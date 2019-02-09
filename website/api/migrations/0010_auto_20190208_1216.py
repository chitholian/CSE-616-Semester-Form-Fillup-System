# Generated by Django 2.1.5 on 2019-02-08 12:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_auto_20190208_1101'),
    ]

    operations = [
        migrations.AlterField(
            model_name='exam',
            name='status',
            field=models.CharField(choices=[(1, 'Pending for attendance entry'), (2, 'Pending for chairman approval'), (3, 'Pending for fees imposure'), (4, 'Pending for provost approval'), (5, 'Pending for payment'), (6, 'Payment completed')], default='b', max_length=1),
        ),
        migrations.AlterField(
            model_name='examform',
            name='status',
            field=models.CharField(choices=[(1, 'Pending for attendance entry'), (2, 'Pending for chairman approval'), (3, 'Pending for fees imposure'), (4, 'Pending for provost approval'), (5, 'Pending for payment'), (6, 'Payment completed'), (0, 'Not applied yet')], max_length=1),
        ),
    ]