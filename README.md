MiddleMediaPlayer
=================

Middle Media Player is a media to draw an image sequence in sync with the audio element.


Usage
------------------------------
    <div class="video">
        <canvas id="Canvas" width="320" height="240"></canvas>
        <div class="progress">
            <div class="bar" id="Progress"></div>
        </div>
        <audio controls id="Audio">
            <source src="./sound.mp3">
        </audio>
    </div>
    
    <script src="./mmplayer.js"></script>
    <script>
        //Setting
        var TIME  = 15;
        var FRAME = 360;
        var IMAGE = './images/0.jpg';
    
        var canvas = document.getElementById('Canvas'),
                audio = document.getElementById('Audio'),
                progress = document.getElementById('Progress').style;
    
        var mmp = new mmplayer(canvas, audio, TIME, IMAGE, FRAME);
    
        mmp.addEventListener(mmplayer.PROGRESS, function (event)
        {
            progress.width = event.data/FRAME * 100 +'%';
        });
    
        mmp.load();
    </script>