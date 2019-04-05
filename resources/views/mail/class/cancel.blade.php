@component('mail::message')

**Important: It is mandatory that the procedures in the Class Cancellation Policy detailed below are followed for all cancelled CE classes.**

In accordance with your request, we have cancelled the following CE class:

@component('mail::table')
|                |                                  |
| -------------  |:-------------------------------- |
| CE Course Code | {{ $data->course->course_code }} |
| CE Class Date  | {{ $data->start_date }}          |
| Instructor     | {{ $data->user->name }}          |
@endcomponent

@component('mail::table')
| Class Cancellation Policy |
| -------------------------- |
| The instructor must immediately notify all students who have registered for the class. |
| The instructor or a designated representative **MUST BE** present at the class location 15 minutes prior to the class start time and remain for 15 minutes past the start time to inform anyone that may show up of the class cancellation. |
@endcomponent

Please contact the E2E Team at [educate2earn@amerifirst.us](mailto:educate2earn@amerifirst.us) with any questions.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
