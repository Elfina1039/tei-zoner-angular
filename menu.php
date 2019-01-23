<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-6504044-7', 'auto');
  ga('send', 'pageview');

</script>

<?php

echo '
       
       <div id="mainBanner">

	   <div class="innertube">
	   <h1 style="text-align: left;"><img style="vertical-align:middle; border:0px;" src="./images/TEI-CAT-logo.png"/> TEI Critical Apparatus Toolbox</h1>
       </div>
	   
<div id="menu">
           <nav>
             <ul id="onglets">';
			 
			 
				if ($menu == '') {
					echo '<li class="active"><a href="index.php">Home</a></li>';              
				} else {
					echo '<li><a href="http://teicat.huma-num.fr/index.php">Home</a></li>';  
				}
				
				if ($menu == 'check') {
					echo '<li class="active"><a href="check.php">Check your encoding</a></li>';			  
				} else {
					echo '<li><a href="check.php">Check your encoding</a></li>';			  					
				}
				
				if ($menu == 'parallel') {
					echo '<li class="active"><a href="witnesses.php">Display parallel versions</a></li>';
				} else {
					echo '<li><a href="witnesses.php">Display parallel versions</a></li>';
				}

				if ($menu == 'print') {
					echo '<li class="active"><a href="print.php">Print an edition</a></li>';
				} else {
					echo '<li><a href="print.php">Print an edition</a></li>';
				}
				
				if ($menu == 'zoner') {
					echo '<li class="active"><a href="zoner.php">Annotate an image</a></li>';
				} else {
					echo '<li><a href="zoner.php">Annotate an image</a></li>';
				}

				if ($menu == 'stats') {
					echo '<li class="active"><a href="stats.php">Get statistics</a></li>';
				} else {
					echo '<li><a href="stats.php">Get statistics</a></li>';
				}
				
				if ($menu == 'help') {
					echo '<li class="active"><a href="help.php">Help</a></li>';
				} else {
					echo '<li><a href="help.php">Help</a></li>';
				}
				
				if ($menu == 'download') {
					echo '<li class="active"><a href="download.php">Download</a></li>';
				} else {
					echo '<li><a href="download.php">Download</a></li>';
				}
 
				if ($menu == 'credits') {
					echo '<li class="active"><a href="credits.php">Credits</a></li>';
				} else {
					echo '<li><a href="credits.php">Credits</a></li>';
				}

               			   
               
              		   
			   
			   
echo '		</ul>
			  </nav>
		  </div>';
		  
	

?>