var updateCounter = function (ecode, n) {
  var n = n || 1;
  var ecid = "#ec"+ecode;
  console.log(ecid);
  var c = $(ecid).html();
  $(ecid).html(parseInt(c)+n);
}
$( document ).ready(function() {
  AV.initialize("TXedaatAW9WaQMQjXLLieCED-gzGzoHsz", "eRDBYAMn3vzynFcCowyuIqQU");
  (function () {
    var query = new AV.Query('Donation');
    query.greaterThan('count', 0);
    query.find().then(function (results) {
      for (var i = 0; i < results.length; i++) {
        var ecode = results[i].attributes.ecode;
        var count = results[i].attributes.count;
        updateCounter(ecode, count);
      }
    }, function (err) {
      console.log('Init Error: ' + error.code + ' ' + error.message);
    });
  })()
  $("img.emoji").click(function(e){
    var ename = $(this).attr("data-name");
    var ecode = $(this).attr("alt");

    var query = new AV.Query('Donation');
    query.equalTo('ename', ename);
    query.first().then(function (result) {
      if (!result) {
        // create
        var Donation = AV.Object.extend('Donation');
        var donation = new Donation();
        donation.save({
          ename: ename,
          ecode: ecode,
          count: 1,
          user: navigator.userAgent
        }).then(function(d){
          updateCounter(ecode);
        }, function (err) {
          console.log("failed");
        });
      } else {
        query.get(result.id).then(function(dona) {
          dona.set('count', result.attributes.count+1);
          dona.save();
          updateCounter(ecode);
        }, function(error) {
          console.log('Error: ' + error.code + ' ' + error.message);
        });
      }
    }, function (error) {
      console.log('Error: ' + error.code + ' ' + error.message);
    })
  })
});
