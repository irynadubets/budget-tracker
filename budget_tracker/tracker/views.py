from datetime import timedelta
from django.db.models import Sum
from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenRefreshView

from .models import Income, Expense
from .serializers import (
    RegistrationSerializer,
    LoginSerializer,
    LogoutSerializer,
    IncomeSerializer,
    ExpenseSerializer,
)

User = get_user_model()


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"error": "Refresh token not provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        refresh = RefreshToken(refresh_token)
        access_token = refresh.access_token
        response_data = {
            "access": str(access_token),
            "refresh": str(refresh),
        }

        return Response(response_data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def registration_view(request):
    serializer = RegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response_data = {
            "username": user.username,
            "access": access_token,
            "refresh": refresh_token,
        }

        return Response(response_data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response_data = {
            "username": user.username,
            "access": access_token,
            "refresh": refresh_token,
        }

        return Response(response_data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_data_view(request, period):
    user = request.user

    def filter_data_by_period(items):
        if period == 'day':
            return items.filter(date__gte=timezone.now() - timedelta(days=1))
        elif period == 'week':
            return items.filter(date__gte=timezone.now() - timedelta(days=7))
        elif period == 'month':
            return items.filter(date__gte=timezone.now() - timedelta(days=30))
        elif period == 'year':
            return items.filter(date__gte=timezone.now() - timedelta(days=365))
        else:
            return items

    incomes = filter_data_by_period(Income.objects.filter(user=user))
    expenses = filter_data_by_period(Expense.objects.filter(user=user))

    income_total = incomes.aggregate(Sum("amount"))["amount__sum"] or 0
    expense_total = expenses.aggregate(Sum("amount"))["amount__sum"] or 0

    income_serializer = IncomeSerializer(incomes, many=True)
    expense_serializer = ExpenseSerializer(expenses, many=True)

    return Response(
        {
            "incomes": income_serializer.data,
            "expenses": expense_serializer.data,
            "incomeTotal": income_total,
            "expenseTotal": expense_total,
        }
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()

        serializer = LogoutSerializer({"detail": "Successfully logged out."})
        return Response(serializer.data, status=status.HTTP_200_OK)

    except TokenError as e:
        serializer = LogoutSerializer({"detail": f"Invalid refresh token. {str(e)}"})
        return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_income_view(request):
    serializer = IncomeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_income_view(request):
    incomes = Income.objects.filter(user=request.user)
    serializer = IncomeSerializer(incomes, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_income_view(request, income_id):
    income = get_object_or_404(Income, pk=income_id, user=request.user)
    serializer = IncomeSerializer(income, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_income_view(request, income_id):
    income = get_object_or_404(Income, pk=income_id, user=request.user)
    income.delete()
    return Response(
        {"detail": "Income record deleted successfully."},
        status=status.HTTP_204_NO_CONTENT,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_expense_view(request):
    serializer = ExpenseSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_expense_view(request):
    expenses = Expense.objects.filter(user=request.user)
    serializer = ExpenseSerializer(expenses, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_expense_view(request, expense_id):
    expense = get_object_or_404(Expense, pk=expense_id, user=request.user)
    serializer = ExpenseSerializer(expense, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_expense_view(request, expense_id):
    expense = get_object_or_404(Expense, pk=expense_id, user=request.user)
    expense.delete()
    return Response(
        {"detail": "Expense record deleted successfully."},
        status=status.HTTP_204_NO_CONTENT,
    )


@api_view(["GET"])
def income_sections(request):
    sections = Income.objects.values_list("section", flat=True).distinct()
    return Response({"sections": sections}, status=status.HTTP_200_OK)


@api_view(["GET"])
def expense_sections(request):
    sections = Expense.objects.values_list("section", flat=True).distinct()
    return Response({"sections": sections}, status=status.HTTP_200_OK)
