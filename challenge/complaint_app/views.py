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
        # Get the top 3 complaint types from the user's district
        return Response()