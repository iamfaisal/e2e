@component('mail::message')

**This message does not constitute final class approval. It’s important you do not begin marketing the class until you receive the final CE class approval email.**

Your CE class request has been reviewed and is in process. You will be notified within 2 business days of the approval status.

<<<<<<< HEAD
@component('mail::table')
|                |                                  |
| -------------  | -------------------------------- |
| CE Course Code | {{ $data->course->course_code }} |
| CE Class Date  | {{ $data->start_date }}          |
| Instructor     | {{ $data->user->name }}          |
@endcomponent
=======
    @component('mail::table')
        |                |                                  |
        | -------------  |:-------------------------------- |
        | CE Course Code | {{ $data->course->course_code }} |
        | CE Class Date  | {{ $data->start_date }}          |
        | Instructor     | {{ $data->user->name }}          |
    @endcomponent
>>>>>>> 6b4bd44a81f0c9e185291563519d57884bbc97a9

Please contact the E2E Team at [educate2earn@amerifirst.us](mailto:educate2earn@amerifirst.us) with any questions.

Thanks,<br>
{{ config('app.name') }}
@endcomponent