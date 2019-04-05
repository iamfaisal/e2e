<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class InstructorNewCourse extends Notification
{
    use Queueable;

    public $name;
    public $course;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($name, $course)
    {
        $this->name  = $name;
        $this->course = $course;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->subject('PSRE: New License Added')
                    ->greeting('Hello ' . $this->name . ',')
                    ->line('You have been certified to instruct a new course called ' . $this->course->title . '. You can begin instructing this course immediately.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
