@component('mail::message')

    @component('mail::table')
        |                |                                  |
        | -------------  | -------------------------------- |
        | CE Course Code | {{ $data->course->course_code }} |
        | CE Class Date  | {{ $data->start_date }}          |
        | Instructor     | {{ $data->user->name }}          |
        | Status         | Registered and Approved - Class materials and docs are now available in the E2E system. |
    @endcomponent

    ###Action Required
    **To access your class materials and docs:**

    1. Log into the E2E system and locate your class.
        * Under More Details click on Course Materials for the PowerPoint, facilitators guide and handout.
        * Click on Class Docs for the roster, certificate, and evaluation forms.
    2. **AT LEAST 3 DAYS** prior to the date of your class you must download and print your course materials and class docs to review for accuracy and troubleshoot any technical issues.

    **IMPORTANT:** It is MANDATORY you use the class materials and docs provided by E2E.

    ###Class Cancellation Policy
    **Should you need to cancel a class after it has been approved, please follow these simple steps**
    1. Log into the E2E system and locate your class.
    2. Under More Details click the Cancel button. You will be prompted to:
        Read the E2E cancellation policy
        Select a reason for cancellation
    3. You MUST notify all registered participants of the cancellation.

    *IMPORTANT:* The instructor or a designated representative must be present at the class location 15 minutes prior to the class start time and remain for 15 minutes past the start time to inform anyone that may show up of the class cancellation. **THIS STEP IS MANDATORY!**

    Please contact the E2E Team at [educate2earn@amerifirst.us](mailto:educate2earn@amerifirst.us) with any questions.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
