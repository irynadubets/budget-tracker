# Generated by Django 4.2.7 on 2023-11-25 00:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0002_remove_expense_section_remove_income_section'),
    ]

    operations = [
        migrations.AddField(
            model_name='expense',
            name='section',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='income',
            name='section',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]