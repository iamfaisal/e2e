<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" href="{{asset('images/icon.png')}}" sizes="192x192" />
        <link rel="apple-touch-icon-precomposed" href="{{asset('images/icon.png')}}" />
        <meta name="msapplication-TileImage" content="{{asset('images/icon.png')}}" />
        <title>MyCE App</title>
        <link rel="stylesheet" href="{{asset('css/app.css')}}">
    </head>
    <body>
        <div id="root"/>
        <script src="{{asset('js/app.js')}}"></script>
        <script>
            $(function () {
                $('[data-toggle="tooltip"]').tooltip();
            });
        </script>
    </body>
</html>
