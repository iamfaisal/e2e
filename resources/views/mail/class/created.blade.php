@component('mail::message')

    **This message does not constitute final class approval. It’s important
    you do not begin marketing the class until you receive the final CE
    class approval email.**

    Your CE class request has been received and will be reviewed by the E2E Team within 2 business days.

    @component('mail::table')
        | ------------- |:--------------------------------:|
        | CE Course Code| {{ $data->course->course_code }} |
        | CE Class Date | {{ $data->start_date }}          |
        | Instructor    | {{ $data->user->name }}          |
    @endcomponent

    Please contact the E2E Team at
    [educate2earn@amerifirst.us](mailto:educate2earn@amerifirst.us) with any
    questions.

Thanks,<br>
{{ config('app.name') }}
@endcomponent