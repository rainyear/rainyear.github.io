$(document)
  .ready(function() {

    var
      changeSides = function() {
        $('.ui.shape')
          .eq(0)
            .shape('flip over')
            .end()
          .eq(1)
            .shape('flip over')
            .end()
          .eq(2)
            .shape('flip back')
            .end()
          .eq(3)
            .shape('flip back')
            .end()
        ;
      },
      validationRules = {
        firstName: {
          identifier  : 'email',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter an e-mail'
            },
            {
              type   : 'email',
              prompt : 'Please enter a valid e-mail'
            }
          ]
        }
      }
    ;

    $('.ui.dropdown')
      .dropdown({
        on: 'hover'
      })
    ;

    $('.ui.form')
      .form(validationRules, {
        on: 'blur'
      })
    ;

    $('.masthead .information')
      .transition('scale in', 1000)
    ;

    setInterval(changeSides, 3000);

    raws = undefined;
    fmtit = function(){
      if (raws.length == 0) {
        $('.fullscreen.modal').modal('show');
      }else{
        var apas = [];
        raws.split("\n").forEach(function(exp){
          var apa = new APA6(exp);
          apas.push(apa)
        })
        results.html("");
        apas.sort(APA_COMP);

        var line = tmpl("apa_result"), html = "";
        for(var i in apas){
          var a = apas[i];
          var order = parseInt(i) + 1;
          a['order'] = order;
          a['err'] = a.error;
          results.append(line(a));
        }
      }
    }
    results = $("#results");
    $("#inputbtn").on("click", function(){
      $('.fullscreen.modal').modal('show');
      if (raws != undefined) {
        $("#apainputs").html(raws);
      }
    });
    $("#startfmt").on("click", function(){
      $("#loading").show();
      raws = $("#apainputs").val();
      fmtit();
      $("#loading").hide();
    });
  })
;

