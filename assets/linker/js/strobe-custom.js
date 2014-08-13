$(function () {
  
});
//---------------------------------------------------------------------------------------------------------------------------------------
//------ validate the controls in the given form(id padded as variable) diaplys the erroe alert and hignlights the controls which false data
//------------------------------------------------------------------------------------------------------------------------------------------
function FormValidation()
{
    //get all the div which has to be validated
    _.each( $( "div.validate" ), function ( frmObj )
    {
        //Extract the FormId        
        var formId = $( frmObj ).parent().attr( "Id" ), formId_rules = {}, formId_msg = {};
        //Loop through each form which has to be validated
        _.each( $( "#" + formId + " .required" + ", .dateCmp" ), function ( obj )
        {
            if($(obj).hasClass('required'))
            {
                formId_rules[( obj.id )] = { required: true };
                formId_msg[( obj.id )] = { required: $( '#' + formId + ' label[for=' + obj.id + ']' ).text().trim() + " is required" }
            }

            if(($(obj).attr('class')).indexOf('requiredbasedOnOther') > -1 )
            {
                var subtxt=($(obj).attr('class')).split('-');
                //var values=subtxt[2].split(','); 
                var values=subtxt[2];           
                formId_rules[( obj.id )] = { required: function () {                                                
                                                /*if (($("#"+subtxt[1]).val() == values[0])||($("#"+subtxt[1]).val() == values[1])){return true;} 
                                                else {return false; }
                                                }*/

                                                if (((values.indexOf($("#"+subtxt[1]).val())) > -1)&&($("#"+subtxt[1]).val()!="")){return true;} 
                                                else {return false; }
                                                }
                                            }
                formId_msg[( obj.id )] = { required: $( '#' + formId + ' label[for=' + obj.id + ']' ).text().trim() + " is required" }
            }

            //-------------RULES (Start)-------------//
            //checks for the class name ex: email. If exist then attaches the corresponding rule
            obj.className.indexOf( 'email' ) != -1 ? formId_rules[( obj.id )].email = true : null;
            obj.className.indexOf( 'minlength' ) != -1 ? formId_rules[( obj.id )].minlength = $( obj ).data( 'minlength' ) : null;
            //Modified on 26-Feb-2014 start
            //For alphanumeric class also it was taking the numeric class while checking index of
            //hence now checking for hasClass
            //$(obj).hasClass('numeric') == true ? formId_rules[(obj.id)].number = true : null;
            //Modified on 26-Feb-2014 end
            //obj.className.indexOf('numeric') != -1 ? formId_rules[(obj.id)].number = true : null;
            obj.className.indexOf( 'pwd-confirm-cmp' ) != -1 ? formId_rules[( obj.id )].equalTo = "#" + $( "#" + formId + " .required.pwd-cmp" )[0].id : null;
            
            //check if the control has calss starts with dateToCmp then apply the rule
            var result = _.filter( obj.className.split( ' ' ), function ( val )
            {
                if ( val.indexOf( 'dateToCmp' ) != -1 )
                {
                    return val;
                }
            } );

            //check if the control has calss starts with monthYearToCmp then apply the rule
            var resultmntYear = _.filter( obj.className.split( ' ' ), function ( val )
            {
                if ( val.indexOf( 'monthYearToCmp' ) != -1 )
                {
                    return val;
                }
            } );

            resultmntYear.length > 0 ? formId_rules[( obj.id )].greaterThanOrEqualsFromMonthYear = "#" + ( obj.id ) + "," + "#" + resultmntYear[0].replace( 'monthYearToCmp-', '' ) : null;
            if(result.length > 0)
            {
                formId_rules[( obj.id )]={greaterThanOrEqualTo:"#" + result[0].replace( 'dateToCmp-', '' )}
                formId_msg[( obj.id )]={greaterThanOrEqualTo:"test"}
            }
            //result.length > 0 ? formId_rules[( obj.id )].greaterThanOrEqualTo = "#" + result[0].replace( 'dateToCmp-', '' ) : null;
            //result.length > 0 ? formId_msg[( obj.id )].greaterThanOrEqualTo = "test" : null;
            // if the field in not required then dont make the field as required
            //this will happen in case of date comparision
            //formId_rules[( obj.id )].required = $(obj).hasClass('required')==true ? true : false;           
            //-------------RULES (End)-------------//

            //-------------MESSAGES (Start)-------------//
            obj.className.indexOf( 'email' ) != -1 ? formId_msg[( obj.id )].email = $( '#' + formId + ' label[for=' + obj.id + ']' ).text().trim() + " is invalid" : null;
            obj.className.indexOf( 'minlength' ) != -1 ? formId_msg[( obj.id )].minlength = $( '#' + formId + ' label[for=' + obj.id + ']' ).text().trim() + " should be " + $( obj ).data( 'minlength' ) + " characters" : null;
            //obj.className.indexOf('numeric') != -1 ? formId_msg[(obj.id)].number = $('#' + formId + ' label[for=' + obj.id + ']').text().trim() + " is invalid" : null;
            obj.className.indexOf('pwd-confirm-cmp') != -1 ? formId_msg[(obj.id)].equalTo = "Password Mismatch" : null;
            //-------------MESSAGES (End)-------------//
        } );
       
        //call validation wrapper
        setTimeout( vmValidatorWrapper, 0, formId, formId_rules, formId_msg );
    } );
};

    //---------------------------------------------------------------------------------------------------------
    //Modal Progress
    //On Save Action --- "Initiated" -----------------1.hide the body by Id ("rolemodal") 
    //                                                  ex: <div class="modal-body"> <div id="rolemodal"> </div>  
    //                                                2.hide the footer
    //                                                3.Attach the Loading image to the body
    //On Save Success Action --- "CompletedSuccess" --1.Remove the dynamically created div inside the body
    //                                                2.Show the Modal-body 
    //                                                3.Show the Modal-footer 
    //On Save Failure Action --- "CompletedFailure" --1.Remove the dynamically created div inside the body
    //                                                2.Show the Modal-body 
    //                                                3.Show the Modal-footer 
    //                                                4.Display the error message in the div
    //---------------------------------------------------------------------------------------------------------    
    function HandleModalProgress(args) {
        try {
            switch (args.state) {
                case "Initiated":
                    //remove the loader image  
                    $('.modal-body').find(".customLoaderMsg,.loader").remove();
                    $('.' + args.body).css("display", "none"); //hide the body
                    $('.slimScrollDiv').hide();
                    $('.' + args.footer).css("display", "none"); // hide the footer
                    var pm = (args.CustomMsg != undefined) ? '<div class="customLoaderMsg  well-transparent spinner-text-font"><i class="fa fa-spinner fa fa-spin fa fa-lg"></i>&nbsp;' + args.CustomMsg + '</div>' : '<div class="loader" style="padding-left:50%"><div class="fa fa-spinner fa fa-spin fa fa-lg"></div></div>';
                    pm += '<div class="loader" ></div>';
                    // pm += '<div class="loader"><i class="icon-spinner icon-spin icon-large"></i></div>';
                    $('.modal-body').append(pm); //Attach the Loading image to the body
                    break;
                case "CompletedSuccess":
                    $('.modal-body').find(".customLoaderMsg,.loader,.fa fa-spinner").remove(); //Remove the dynamically created div inside the body
                    $('.' + args.body).css("display", "block"); //Show the Modal-body 
                    $('.' + args.footer).css("display", "block"); //Show the Modal-footer 
                    $('.slimScrollDiv').show();
                    break;
                case "CompletedFailure":
                    $('.' + args.body).css("display", "block"); //Show the Modal-body 
                    $('.' + args.footer).css("display", "block"); //Show the Modal-footer 
                    $('.modal-body').find(".customLoaderMsg,.loader,.fa fa-spinner").remove(); ////Remove the dynamically created div inside the body
                    $('.vm-noty-placeholder').noty({ "text": args.message, "layout": "inline", "type": "error" }); //Display the error message in the div
                    $('.slimScrollDiv').show();
                    break;
            }
        } catch (e) { }
    };
    //---------------------------------------------------------------------------------------------------------
    //Loading Image
    //---------------------------------------------------------------------------------------------------------    
    //inline progressbar-Comment by asha(step1)
    function HandleLoadingImage(args) {
        try {
            if (args.progress == 'show') {
                $('#' + args.container).html("");
                $('#' + args.container).append('<div class="customLoaderMsg  well-transparent" style="font-size:17px;padding-left:50%"><i class="fa fa-spinner fa fa-spin fa fa-lg"></i>&nbsp;</div>');
            }
            else {
                $('#' + args.container).find(".customLoaderMsg").remove();
                //$('#' + args.id).remove();
            }
        } catch (e) { }
    };

    //---------------------------------------------------------------------------------------------------------
    //Ajax Post Call. Append csrf token to all ajax post to avoid 403 forbidden error
    //argrs -----------------Object to hold the post ajax call parameter such as url and data to be passed
    // args.api -------------Post Url
    // args.Data ------------Data to be send to the post call
    //---------------------------------------------------------------------------------------------------------    
    function PerformAjaxPost(args) {    
        //Initiate ajax call for both ie retrieving csrftoken 
        //and performing ajax post url with the token received in the previous call
        var promisePostCallList = $.when($.ajax(location.origin + '/csrftoken')
                                   .then(function (res) {
                                       var promisePost = $.ajax({ url: location.origin + args.api,
                                           beforeSend: function (xhr) {
                                               xhr.setRequestHeader('X-CSRF-Token', res._csrf);
                                           },
                                           data: JSON.stringify(args.Data),
                                           type: 'post',
                                           dataType: 'json',
                                           contentType: 'application/json'
                                       });
                                       promisePost.done(function (data) {
                                           //Publish Success Event
                                           $.Topic('ajaxPostSuccess').publish(data);
                                       });
                                       promisePost.fail(function () {
                                           //Publish Failure Event
                                           console.log("Something went wrong in post ajax")
                                       });
                                   }, function (err) {
                                       console.log("Something went wrong in retrieval of csrf token")
                                   }));
    }


    function GetWeeksBasedOnMonthAndYear(year, month) {
    //declare array to hold week periods for a selected year and month
    var weekPeriods = [];
    //declare array to hold all days which are sundays
    var days = [];
    //get the start date of a particular month  in  a year where week starts from Sunday
    var date = new Date(year, month, 1);
    //check whether the day is not sunday
    while (date.getDay() != 0) {
        //add 1 to date to go for next day
        date.setDate(date.getDate() + 1);
    }
    //the loop should run until the the year matches with user selected year
    while (date.getFullYear() == year && date.getMonth() == month) {
        //get month of the date
        var m = date.getMonth() + 1;
        //get date of the date
        var d = date.getDate();
        //push the date to an array
        days.push(
          year + '-' +
          (m < 10 ? '0' + m : m) + '-' +
          (d < 10 ? '0' + d : d)
        );
        //add 7 days to date and set the date
        date.setDate(date.getDate() + 7);
    }
    //declare variable to hold all months three letter code
    var monthname = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    //loop for each date in an array and get the week period
    for (var d in days) {
        //set the start date 
        var startDt = new Date(days[d]);
        //set the end date as start date
        var endDt = new Date(days[d]);
        //get the year of start date
        var stYear = startDt.getFullYear().toString();
        //declare variable to hold Week Start Date in the format ddMMMYY
        var weekBeginDt = ((startDt.getDate() < 10) ? '0' + startDt.getDate() : startDt.getDate()) + monthname[startDt.getMonth()] + stYear.substring(2);
        //set the date of End Date
        endDt.setDate(endDt.getDate() + 6);
        //get the year of End Date
        var endYear = endDt.getFullYear().toString();
        //declare variable to hold Week End Date in the format ddMMMYY
        var weekEndDt = ((endDt.getDate() < 10) ? '0' + endDt.getDate() : endDt.getDate()) + monthname[endDt.getMonth()] + endYear.substring(2);
        var weekIndex = parseInt(d) + 1;
        //push the Week period in to Array
        //push Week name, Week period, index
        weekPeriods.push(["W" + weekIndex, weekBeginDt + "-" + weekEndDt, d, startDt, endDt]);
    }

    //return WeekPeriods
    return weekPeriods;
}