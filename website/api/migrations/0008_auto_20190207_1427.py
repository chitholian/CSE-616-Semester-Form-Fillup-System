# Generated by Django 2.1.5 on 2019-02-07 14:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_auto_20190207_1410'),
    ]

    operations = [
        migrations.RenameField(
            model_name='student',
            old_name='date_of_birth',
            new_name='dob',
        ),
    ]