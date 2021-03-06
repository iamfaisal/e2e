@component('mail::message')

**This message does not constitute final approval of the requested change(s). It's important you do not market the revised class until you receive the change approval email.**

+ All changes to a previously approved class must be accompanied by an updated class flyer, and be reviewed by the E2E Team.
+ Some changes may also require state approval and/or creation of new class documents.

In accordance with your request, we have cancelled the following CE class:

@component('mail::table')
|                |                                  |
| -------------  | :------------------------------- |
| CE Course Code | {{ $data->course->code }}        |
| CE Class Date  | {{ $data->start_date }}          |
| Instructor     | {{ $data->user->name }}          |
@endcomponent

*The E2E Team will review your request and notify you within 2 business days of the status of this class.*

Please contact the E2E Team at [educate2earn@amerifirst.us](mailto:educate2earn@amerifirst.us) with any questions.

Thanks,<br>
{{ config('app.name') }}
@endcomponent