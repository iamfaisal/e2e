@component('mail::message')

    **This message does not constitute final class approval. It&rsquo;s important you do not begin marketing the class until you receive the final CE class approval email.**

    @component('mail::table')
        | ------------- |:------------------------:|
        | CE Course Code| {{ $data->course_code }} |
        | CE Class Date | {{ $data->course_code }} |
        | Instructor    | {{ $data->course_code }} |
    @endcomponent

    Please contact the E2E Team at [educate2earn@amerifirst.us](mailto:educate2earn@amerifirst.us) with any questions.

Thanks,<br>
{{ config('app.name') }}
@endcomponent