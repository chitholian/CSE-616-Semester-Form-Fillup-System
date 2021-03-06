# Generated by Django 2.1.5 on 2019-02-08 17:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_auto_20190208_1218'),
    ]

    operations = [
        migrations.AlterField(
            model_name='exam',
            name='status',
            field=models.PositiveSmallIntegerField(choices=[(1, 'Pending for attendance entry'), (2, 'Pending for chairman approval'), (3, 'Pending for provost approval'), (4, 'Pending for fees imposure'), (5, 'Pending for payment'), (6, 'Payment completed')], default=1),
        ),
        migrations.AlterField(
            model_name='examform',
            name='attendance',
            field=models.PositiveIntegerField(default=-1),
        ),
        migrations.AlterField(
            model_name='examform',
            name='status',
            field=models.PositiveSmallIntegerField(choices=[(1, 'Pending for attendance entry'), (2, 'Pending for chairman approval'), (3, 'Pending for provost approval'), (4, 'Pending for fees imposure'), (5, 'Pending for payment'), (6, 'Payment completed'), (0, 'Not applied yet')], default=1),
        ),
    ]
