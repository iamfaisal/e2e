@component('mail::message')

**This message does not constitute final class approval. It’s important you do not begin marketing the class until you receive the final CE class approval email.**

This class CANNOT BE APPROVED and needs your IMMEDIATE attention. Please login to the E2E system and review this class submission.

@component('mail::table')
|                |                                  |
| -------------- | :------------------------------- |
| CE Course Code | {{ $data->course->code }}        |
| CE Class Date  | {{ $data->start_date }}          |
| Instructor     | {{ $data->user->name }}          |
@endcomponent

### Action Required
@component('mail::table')
|                |                                  |
| -------------- | :------------------------------- |
@foreach($review as $key => $value)
| {{ ucwords(str_replace('_', ' ', $key)) }} | {!! is_bool($value) ? "Needs Attention" : $value !!} |
@endforeach
@endcomponent

**Once all issues are resolved, resubmit the request to
E2E within the state mandated registration window**
+ AZ requires 16 calendar days advance registration.
+ All other states require 10 calendar days advance registration.

Please contact the E2E Team at [educate2earn@amerifirst.us](mailto:educate2earn@amerifirst.us) with any questions.

Thanks,<br>
{{ config('app.name') }}
@endcomponent