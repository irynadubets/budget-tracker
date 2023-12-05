from django.urls import path
from .views import (
    registration_view,
    login_view,
    logout_view,
    add_income_view,
    list_income_view,
    update_income_view,
    delete_income_view,
    add_expense_view,
    list_expense_view,
    update_expense_view,
    delete_expense_view,
    CustomTokenRefreshView,
    user_data_view,
    income_sections,
    expense_sections,
)

urlpatterns = [
    path("register/", registration_view, name="registration"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path("token/refresh/", CustomTokenRefreshView.as_view(), name="token_refresh"),
    path("add-income/", add_income_view, name="add-income"),
    path("list-income/", list_income_view, name="list-income"),
    path("update-income/<int:income_id>/", update_income_view, name="update-income"),
    path("delete-income/<int:income_id>/", delete_income_view, name="delete-income"),
    path("add-expense/", add_expense_view, name="add-expense"),
    path("list-expense/", list_expense_view, name="list-expense"),
    path(
        "update-expense/<int:expense_id>/", update_expense_view, name="update-expense"
    ),
    path(
        "delete-expense/<int:expense_id>/", delete_expense_view, name="delete-expense"
    ),
    path("user-data/", user_data_view, name="user-data"),
    path("income-sections/", income_sections, name="income-sections"),
    path("expense-sections/", expense_sections, name="expense-sections"),
]
