# Generated by Django 2.1.5 on 2019-02-10 17:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_auto_20190210_1724'),
    ]

    operations = [
        migrations.AlterField(
            model_name='student',
            name='avatar',
            field=models.ImageField(upload_to='frontend/static/frontend/avatars/'),
        ),
    ]
