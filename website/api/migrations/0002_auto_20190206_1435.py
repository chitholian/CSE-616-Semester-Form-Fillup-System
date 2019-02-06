# Generated by Django 2.1.5 on 2019-02-06 14:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Exam',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=128)),
                ('active', models.BooleanField(default=True)),
                ('fees_per_credit', models.PositiveIntegerField()),
                ('allowed_attendance', models.PositiveIntegerField()),
                ('fined_attendance', models.PositiveIntegerField()),
                ('attendance_fine', models.PositiveIntegerField()),
                ('ldo_form_fill_up', models.DateField()),
                ('ldo_payment', models.DateField()),
                ('status', models.CharField(choices=[('b', 'Pending for attendance entry'), ('c', 'Pending for chairman approval'), ('d', 'Pending for fees imposure'), ('e', 'Pending for provost approval'), ('f', 'Pending for payment'), ('g', 'Payment completed'), ('a', 'Not applied yet')], max_length=1)),
                ('semester', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Semester')),
            ],
        ),
        migrations.CreateModel(
            name='ExamForm',
            fields=[
                ('id', models.DateField(primary_key=True, serialize=False)),
                ('status', models.CharField(choices=[('b', 'Pending for attendance entry'), ('c', 'Pending for chairman approval'), ('d', 'Pending for fees imposure'), ('e', 'Pending for provost approval'), ('f', 'Pending for payment'), ('g', 'Payment completed'), ('a', 'Not applied yet')], max_length=1)),
                ('exam', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Exam')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Student')),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='examform',
            unique_together={('exam', 'student')},
        ),
    ]