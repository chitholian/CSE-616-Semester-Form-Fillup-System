# Generated by Django 2.1.5 on 2019-02-06 14:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20190206_1439'),
    ]

    operations = [
        migrations.AddField(
            model_name='examform',
            name='attendance',
            field=models.PositiveIntegerField(default=0),
            preserve_default=False,
        ),
    ]