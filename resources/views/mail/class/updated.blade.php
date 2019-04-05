@component('mail::message')

    **This message does not constitute final class approval. It’s important
    you do not begin marketing the class until you receive the final CE
    class approval email.**

    + All changes to a previously approved class must be accompanied by an updated class flyer, and be reviewed by the E2E Team.
    + Some changes may also require state approval and/or creation of new class documents.

    In accordance with your request, we have cancelled the following CE class:

    @component('mail::table')
        |                |                                  |
        | -------------  |:-------------------------------- |
        | CE Course Code | {{ $data->course->course_code }} |
        | CE Class Date  | {{ $data->start_date }}          |
        | Instructor     | {{ $data->user->name }}          |
    @endcomponent

    *The E2E Team will review your request and notify you within 2 business days of the status of this class.*

    Please contact the E2E Team at [educate2earn@amerifirst.us](mailto:educate2earn@amerifirst.us) with any questions.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
