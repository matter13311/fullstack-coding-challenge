from rest_framework import viewsets
from .models import UserProfile, Complaint
from .serializers import UserSerializer, UserProfileSerializer, ComplaintSerializer
from rest_framework.response import Response
from rest_framework import status
# Create your views here.

#this function, given a user object, will return the padded district of the user
def get_padded_district(user):
    try:
        user_profile = UserProfile.objects.get(user=user)
        user_district = user_profile.district
        padded_district = user_district.zfill(2)  # pad single-digit district with a leading zero
        return padded_district
    except UserProfile.DoesNotExist:
        return None

class ComplaintViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = ComplaintSerializer

    def list(self, request):
        padded_district = get_padded_district(request.user)
        if not padded_district:
            return Response(
                {"error": "UserProfile not found for the authenticated user."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # filter complaints where the account matches the padded district
        complaints = Complaint.objects.filter(account__endswith=padded_district)

        serializer = self.serializer_class(complaints, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class OpenCasesViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = ComplaintSerializer

    def list(self, request):
        padded_district = get_padded_district(request.user)
        if not padded_district:
            return Response(
                {"error": "UserProfile not found for the authenticated user."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # filter complaints where the account matches the district and closedate is null (open cases)
        open_complaints = Complaint.objects.filter(account__endswith=padded_district, closedate__isnull=True)

        serializer = self.serializer_class(open_complaints, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ClosedCasesViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = ComplaintSerializer

    def list(self, request):
        padded_district = get_padded_district(request.user)
        if not padded_district:
            return Response(
                {"error": "UserProfile not found for the authenticated user."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # filter complaints where the account matches the district and closedate is not null (closed cases)
        closed_complaints = Complaint.objects.filter(account__endswith=padded_district, closedate__isnull=False)

        serializer = self.serializer_class(closed_complaints, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TopComplaintTypeViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']

    def list(self, request):
        padded_district = get_padded_district(request.user)
        if not padded_district:
            return Response(
                {"error": "UserProfile not found for the authenticated user."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # get all complaints for the user's district where complaint_type is not null
        complaints = Complaint.objects.filter(account__endswith=padded_district, complaint_type__isnull=False)

        # count occurrences of each complaint_type into the following structure example
        #{'Housing and Buildings': 6, 'Economy/Jobs': 7, 'Aging': 1, 'General Welfare': 2, 'Health': 1}
        complaint_type_counts = {}
        for complaint in complaints:
            complaint_type = complaint.complaint_type
            if complaint_type in complaint_type_counts:
                complaint_type_counts[complaint_type] += 1
            else:
                complaint_type_counts[complaint_type] = 1

        # sort complaint types by count in descending order and get the top 3
        sorted_complaint_types = sorted(
            complaint_type_counts.items(), key=lambda x: x[1], reverse=True
        )[:3]

        response_data = [
            {"complaint_type": complaint_type, "count": count}
            for complaint_type, count in sorted_complaint_types
        ]

        return Response(response_data, status=status.HTTP_200_OK)

class ConstituentComplaintViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = ComplaintSerializer

    def list(self, request):
        padded_district = get_padded_district(request.user)
        if not padded_district:
            return Response(
                {"error": "UserProfile not found for the authenticated user."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # filter complaints where the council district matches the padded district
        complaints = Complaint.objects.filter(
            council_dist__endswith=padded_district
        )

        serializer = self.serializer_class(complaints, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)