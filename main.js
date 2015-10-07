var youTubeSearch = (function() {
    
    var el = document.getElementById('youTubeSearch'),
        textReceiver = document.getElementById('YouTubeTextReceiver'),
        videosReceiver = document.getElementById('youTubeList'),
        form = document.getElementById('youTubeSearchForm'),
        submit = document.getElementById('youTubeSubmit'),
        videosList = [],
        init = function() {
            _listener();
            console.log('YOUTUBE SEARCH MODULE INIT');
        };
    
    function _listener() {
        el.addEventListener('keyup', function() {
            _setValue(el.value);
        });
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('YOUTUBE SEARCH SUBMIT');
            _getSomeVideos(el.value);
        });
    }
    
    function _setValue(val) {
        
        //Form validation
        val === '' ? submit.disabled = 'disabled' : submit.removeAttribute('disabled');
        
        //Input value binding
        val === '' ? textReceiver.innerHTML = '' : textReceiver.innerHTML = 'Поиск по запросу <b>' + val + '</b>';
    }
    
    function _getSomeVideos(val) {
        
        videosReceiver.innerHTML = 'Поиск...';
        
        //Load Google API client and start chain of functions
        gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
        
        function onYouTubeApiLoad() {
            
            //This ApiKey is only for testing. Change it to your own ApiKey from Google Developers Console
            gapi.client.setApiKey('AIzaSyAC9wbBMzGSD-mAEOP_-U81vrtDw-7A-sc');
            search(val);
        }

        function search(val) {
            var request = gapi.client.youtube.search.list({
                q: val,
                part: 'snippet',
                maxResults: 10
            });
            request.execute(onSearchResponse);
        }

        function onSearchResponse(response) {
            _sortListOfVideos(response);
        }
        
        function _sortListOfVideos(object) {
            var resItems = object.result.items;
            
            //Playlists and videochannels must be ignored
            for (var res in resItems) {
                if(resItems[res].id.kind === 'youtube#video') {
                    videosList.push(resItems[res]);
                }
            }
            
            //Sort list in right order and send it to render func
            videosList = videosList.reverse();
            _renderVideoList(videosList);
        }
        
        function _renderVideoList(videosList) {
            
            //Clean video list
            videosReceiver.innerHTML = '';
            textReceiver.innerHTML = 'Результаты поиска по запросу <b>' + val + '</b>';
            
            //Render video list
            for (var video in videosList) {
                videosReceiver.insertAdjacentHTML('afterbegin', '<li><p><a href="http://youtube.com/watch?v=' + videosList[video].id.videoId + '">' + videosList[video].snippet.title+ '</a> <small class="text-muted">' + videosList[video].snippet.description + '</small></li>');
            }
            
            //Clean result list
            videosList.splice(0, videosList.length);
            submit.disabled = 'disabled';
            form.reset();
        }
    }
    
    return {
        init: init
    }
})();

youTubeSearch.init();