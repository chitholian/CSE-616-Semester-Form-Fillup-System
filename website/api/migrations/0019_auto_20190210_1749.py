# Generated by Django 2.1.5 on 2019-02-10 17:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0018_auto_20190210_1744'),
    ]

    operations = [
        migrations.AlterField(
            model_name='student',
            name='avatar',
            field=models.ImageField(upload_to='frontend/avatars/frontend/'),
        ),
    ]