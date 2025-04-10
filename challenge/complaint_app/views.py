from rest_framework import viewsets
from .models import UserProfile, Complaint
from .serializers import UserSerializer, UserProfileSerializer, ComplaintSerializer
from rest_framework.response import Response
from rest_framework import status
# Create your views here.

class ComplaintViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = ComplaintSerializer

    def list(self, request):
        # fetch the UserProfile for the authenticated user
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            user_district = user_profile.district  # get the district of the user
            print("UserProfile:", user_profile)  
            print("User District:", user_district)  
        except UserProfile.DoesNotExist:
            return Response(
                {"error": "UserProfile not found for the authenticated user."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Handle single-digit district padding
        padded_district = user_district.zfill(2)  # Pad single-digit district with a leading zero
        print("Padded District:", padded_district) 

        # filter complaints where the account matches the padded district
        # we know the format is always NYCCXX, where XX is the district number
        # so we can filter by checking if the account ends with the padded district
        complaints = Complaint.objects.filter(account__endswith=padded_district)

        # serialize the complaints to JSON
        serializer = self.serializer_class(complaints, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class OpenCasesViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = ComplaintSerializer

    def list(self, request):
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            user_district = user_profile.district 
        except UserProfile.DoesNotExist:
            return Response(
                {"error": "UserProfile not found for the authenticated user."},
                status=status.HTTP_404_NOT_FOUND,
            )

        padded_district = user_district.zfill(2)  

        # filter complaints where the account matches the district and closedate is null (open cases)
        open_complaints = Complaint.objects.filter(account__endswith=padded_district, closedate__isnull=True)

        serializer = self.serializer_class(open_complaints, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ClosedCasesViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = ComplaintSerializer

    def list(self, request):
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            user_district = user_profile.district  
        except UserProfile.DoesNotExist:
            return Response(
                {"error": "UserProfile not found for the authenticated user."},
                status=status.HTTP_404_NOT_FOUND,
            )

        padded_district = user_district.zfill(2)  

        # filter complaints where the account matches the district and closedate is not null (closed cases)
        closed_complaints = Complaint.objects.filter(account__endswith=padded_district, closedate__isnull=False)

        serializer = self.serializer_class(closed_complaints, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class TopComplaintTypeViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']

    def list(self, request):
        try:
            # Fetch the UserProfile for the authenticated user
            user_profile = UserProfile.objects.get(user=request.user)
            user_district = user_profile.district  # Get the district of the user
        except UserProfile.DoesNotExist:
            return Response(
                {"error": "UserProfile not found for the authenticated user."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Handle single-digit district padding
        padded_district = user_district.zfill(2)  # Pad single-digit district with a leading zero

        # Get all complaints for the user's district where complaint_type is not null
        complaints = Complaint.objects.filter(
            account__endswith=padded_district, complaint_type__isnull=False
        )

        # Count occurrences of each complaint_type
        complaint_type_counts = {}
        for complaint in complaints:
            complaint_type = complaint.complaint_type
            if complaint_type in complaint_type_counts:
                complaint_type_counts[complaint_type] += 1
            else:
                complaint_type_counts[complaint_type] = 1

        # Sort complaint types by count in descending order and get the top 3
        sorted_complaint_types = sorted(
            complaint_type_counts.items(), key=lambda x: x[1], reverse=True
        )[:3]

        # Prepare the response data
        response_data = [
            {"complaint_type": complaint_type, "count": count}
            for complaint_type, count in sorted_complaint_types
        ]

        return Response(response_data, status=status.HTTP_200_OK)

class ConstituentComplaintViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = ComplaintSerializer

    def list(self, request):
        try:
            # Fetch the UserProfile for the authenticated user
            user_profile = UserProfile.objects.get(user=request.user)
            user_district = user_profile.district  # Get the district of the user
        except UserProfile.DoesNotExist:
            return Response(
                {"error": "UserProfile not found for the authenticated user."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Handle single-digit district padding
        padded_district = user_district.zfill(2)  # Pad single-digit district with a leading zero

        complaints = Complaint.objects.filter(
            council_dist__endswith=padded_district, council_dist__isnull=False
        )

       # serialize the complaints to JSON
        serializer = self.serializer_class(complaints, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)