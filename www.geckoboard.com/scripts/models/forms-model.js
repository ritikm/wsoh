/**
 * FormsModel javascript file.
 *
 * @author Dmitry Avseyenko <polsad@gmail.com>
 * @package scripts.models
 * @copyright Copyright &copy; 2010 GeckoBoard
 */
FormsModel = {
    initUpdateBilling: function(form, rules, errors) {
        var v = new Validator({form: '#'+form, errorLine: true, errorClass: 'f-error-fld', errorBox: '#error-box'}, rules);
        v.addRule('test', "[\d]+")
         .rule('input[name="account[first_name]"]', 'filled', errors[0], '#e-first-name')
         .rule('input[name="account[last_name]"]', 'name', errors[1], '#e-last-name')
         .rule('input[name="billing_info[credit_card][number]"]', 'filled', errors[2], '#e-card-number')
         .rule('input[name="billing_info[credit_card][verification_value]"]', 'cvv', errors[3], '#e-cvv')
         .rule('input[name="billing_info[address1]"]', 'filled', errors[4], '#e-address1')
         .rule('input[name="billing_info[city]"]', 'filled', errors[5], '#e-city')
         .rule('input[name="billing_info[zip]"]', 'filled', errors[6], '#e-zip')
         .rule('input[name="billing_info[state]"]', 'filled', errors[7], '#e-state')
    },
    initUpdateBillingCard: function(form, rules, errors) {
        var v = new Validator({form: '#'+form, errorLine: true, errorClass: 'f-error-fld', errorBox: '#error-box'}, rules);
        v.addRule('test', "[\d]+")
         .rule('input[name="account[first_name]"]', 'filled', errors[0], '#e-first-name')
         .rule('input[name="account[last_name]"]', 'name', errors[1], '#e-last-name')
         .rule('input[name="billing_info[credit_card][number]"]', 'filled', errors[2], '#e-card-number')
         .rule('input[name="billing_info[credit_card][verification_value]"]', 'cvv', errors[3], '#e-cvv')
         .rule('input[name="billing_info[address1]"]', 'filled', errors[4], '#e-address1')
         .rule('input[name="billing_info[city]"]', 'filled', errors[5], '#e-city')
         .rule('input[name="billing_info[zip]"]', 'filled', errors[6], '#e-zip')
         .rule('input[name="billing_info[state]"]', 'filled', errors[7], '#e-state')
         return v;
    },
    initSignupStep1Form: function(form, rules, errors) {
        var v = new Validator({form: '#'+form, errorLine: true, errorClass: 'f-error-fld', errorBox: '#error-box'}, rules);
        v.rule('input[name=fname]', 'filled', errors[0])
         .rule('input[name=fname]', 'name', errors[8])
         .rule('input[name=lname]', 'filled', errors[1])
         .rule('input[name=lname]', 'name', errors[9])
         .rule('input[name=email]', 'filled', errors[3])
         .rule('input[name=email]', 'email', errors[10])
         .rule('input[name=pass]', 'filled', errors[4])
         .rule('input[name=cpass]', 'filled', errors[5])
         .rule('input[name=pass]', 'password', errors[12])
         .rule('input[name=cpass]', 'password', errors[13])
         .compare('input[name=pass]', 'input[name=cpass]', errors[11])
         .rule('input[name=account]', 'filled', errors[6])
         .rule('input[name=coupon]', 'coupon', errors[14])
         .checked('input[name=terms]', errors[7])
    },
    initSignupStep1FormCard: function(form, rules, errors) {
        var v = new Validator({form: '#'+form, errorLine: true, errorClass: 'f-error-fld', errorBox: '#error-box'}, rules);
        v.rule('input[name=fname]', 'filled', errors[0])
         .rule('input[name=fname]', 'name', errors[8])
         .rule('input[name=lname]', 'filled', errors[1])
         .rule('input[name=lname]', 'name', errors[9])
         .rule('input[name=email]', 'filled', errors[3])
         .rule('input[name=email]', 'email', errors[10])
         .rule('input[name=pass]', 'filled', errors[4])
         .rule('input[name=cpass]', 'filled', errors[5])
         .rule('input[name=pass]', 'password', errors[12])
         .rule('input[name=cpass]', 'password', errors[13])
         .compare('input[name=pass]', 'input[name=cpass]', errors[11])
         .rule('input[name=account]', 'filled', errors[6])
         .rule('input[name=coupon]', 'coupon', errors[14])
         .checked('input[name=terms]', errors[7])
          return v;
    },
    initSignupStep1FormCC: function(form, rules, errors) {
        var v = new Validator({form: '#'+form, errorLine: true, errorClass: 'f-error-fld', errorBox: '#error-box'}, rules);
        v.rule('input[name=fname]', 'filled', errors[0])
         .rule('input[name=fname]', 'name', errors[8])
         .rule('input[name=lname]', 'filled', errors[1])
         .rule('input[name=lname]', 'name', errors[9])
         .rule('input[name=email]', 'filled', errors[3])
         .rule('input[name=email]', 'email', errors[10])
         .rule('input[name=pass]', 'filled', errors[4])
         .rule('input[name=cpass]', 'filled', errors[5])
         .rule('input[name=pass]', 'password', errors[12])
         .rule('input[name=cpass]', 'password', errors[13])
         .compare('input[name=pass]', 'input[name=cpass]', errors[11])
         .rule('input[name=account]', 'filled', errors[6])
         .rule('input[name=coupon]', 'coupon', errors[14])
         .checked('input[name=terms]', errors[7])
         .rule('input[name=b_fname]', 'filled', errors[15])
         .rule('input[name=b_lname]', 'filled', errors[16])
         .rule('input[name=b_card]', 'filled', errors[17])
         .rule('input[name=b_cvv]', 'cvv', errors[18])
         .rule('input[name=b_address]', 'filled', errors[19])
         .rule('input[name=b_zip]', 'filled', errors[21])
         .rule('input[name=b_city]', 'filled', errors[20])
         .rule('input[name=b_state]', 'filled', errors[22]);
        
    },
    initSignupForm: function(form, errors) {
        $('#'+form).submit(function() { 
            $(this).ajaxSubmit({
                beforeSubmit: function(formData, jqForm, options) { 
                    var email = $('#'+form+' input[name=sign-email]').val();
                    if (email == '') {
                        $('#'+form+' .f-error-msg').html(errors[0]).css('display','block');
                        $('#'+form+' input[name=sign-email]').addClass('f-error-fld');
                        return false;
                    }
                    var emailrule = new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9_-]+[\.][a-zA-Z0-9._-]+$');
                    if (! emailrule.test(email)) {
                        $('#'+form+' .f-error-msg').html(errors[1]).css('display','block');
                        $('#'+form+' input[name=sign-email]').addClass('f-error-fld');
                        return false;
                    }
		    var icode = $('#'+form+' input[name=sign-icode]').val();
		    if (icode == '') {
			$('#'+form+' .f-error-msg').html(errors[2]).css('display','block');
                        $('#'+form+' input[name=sign-icode]').addClass('f-error-fld');
			
			return false;
		    }
                    $(jqForm).find('input').attr('disabled', 'true');
                    return true;                    
                },
                success: function(responseText) {
                    $('#'+form+' .f-error-msg').css('display','none');
                    $('#'+form+' .f-message-msg').css('display','none');
                    $('#'+form+' input').removeClass('f-error-fld');
                    
                    if (responseText.error != undefined) {
                        $('#'+form+' .f-error-msg').html(responseText.error).css('display','block');
                    }
                    if (responseText.fields != undefined) {
                        for (var i = 0; i < responseText.fields.length; i++) {
                            $('#'+form+' input[name='+responseText.fields[i]+']').addClass('f-error-fld');
                        }
                    }
                    if (responseText.message != undefined) {
                        $('#'+form+' section.f-home-body').remove();
                        $('#'+form+' footer.clrfix').remove();
                        $('#'+form+' .f-message-msg').html(responseText.message).css('display','block');
                    }    
                    if (responseText.redirect != undefined) {
                        document.location.href = document.location.protocol+'//'+document.location.host+'/'+responseText.redirect;
                    }
                    
                    $('#'+form+' input').removeAttr('disabled');
                    return true;
                },
                error: function() {
                    $('#'+form+' .f-error-msg').html('Server error.').css('display','block');
                    $('#'+form+' input').removeClass('f-error-fld');
                    $('#'+form+' input').removeAttr('disabled');
                },
                dataType: 'json' 
            }); 
            return false; 
        }); 
    },
    initSignupStep2Form: function(form, errors) {
        $('#'+form).submit(function() {
            $(this).ajaxSubmit({
                beforeSubmit: function(formData, jqForm, options) {
                    $('#'+form+' .f-message-msg').css('display','none');
                    $('#'+form+' input').removeClass('f-error-fld');

                    var name    = $.trim($('#'+form+' input[name=sign-name]').val());
                    var pass    = $.trim($('#'+form+' input[name=sign-password]').val());
                    var cpass   = $.trim($('#'+form+' input[name=sign-cpassword]').val());
                    var account = $.trim($('#'+form+' input[name=sign-account]').val());
                    var error   = '';
                    var eflag   = true;

                    if (name == '' || pass == '' || cpass == '' || account == '') {
                        if (name == '') {
                            error = error + errors[0];
                            $('#'+form+' input[name=sign-name]').addClass('f-error-fld');
                        }
                        if (account == '') {
                            error = error + errors[1];
                            $('#'+form+' input[name=sign-account]').addClass('f-error-fld');
                        }
                        if (pass == '') {
                            error = error + errors[2];
                            $('#'+form+' input[name=sign-password]').addClass('f-error-fld');
                        }
                        if (cpass == '') {
                            error = error + errors[3];
                            $('#'+form+' input[name=sign-cpassword]').addClass('f-error-fld');
                        }
                        eflag = false;
                    }
                    if (pass != '' && cpass != '' && pass != cpass) {
                        error = error + errors[4];
                        $('#'+form+' input[name=sign-password]').addClass('f-error-fld');
                        $('#'+form+' input[name=sign-cpassword]').addClass('f-error-fld');
                        eflag = false;
                    }

                    if (eflag == false) {
                        $('#'+form+' .f-error-msg').html(error).css('display','block');
                        return false;
                    }
                    
                    $(jqForm).find('input').attr('disabled', 'true');
                    return true;
                },
                success: function(responseText) {
                    $('#'+form+' .f-error-msg').css('display','none');
                    $('#'+form+' input').removeClass('f-error-fld');

                    if (responseText.error != undefined) {
                        $('#'+form+' .f-error-msg').html(responseText.error).css('display','block');
                    }
                    if (responseText.fields != undefined) {
                        for (var i = 0; i < responseText.fields.length; i++) {
                            $('#'+form+' input[name='+responseText.fields[i]+']').addClass('f-error-fld');
                        }
                    }
                    if (responseText.redirect != undefined) {
                        FormsModel.redirect(responseText.redirect);
                    }
                    $('#'+form+' input').removeAttr('disabled');
                    return true;
                },
                error: function() {
                    $('#'+form+' .f-error-msg').html('Server error.').css('display','block');
                    $('#'+form+' input').removeClass('f-error-fld');
                    $('#'+form+' input').removeAttr('disabled');
                },
                dataType: 'json' 
            });
            return false;
        });
    },
    initLoginForm: function(form, errors) {
        $('#'+form).bind("submit", function() {
            $(this).ajaxSubmit({
                beforeSubmit: function(formData, jqForm, options) {
                    $('#'+form+' .f-message-msg').css('display','none');
                    $('#'+form+' input').removeClass('f-error-fld');

                    var email  = $.trim($('#'+form+' input[name=login-email]').val());
                    var pass   = $.trim($('#'+form+' input[name=login-password]').val());
                    var error  = '';
                    var eflag  = true;
                    var emailrule = new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9_-]+[\.][a-zA-Z0-9._-]+$');

                    if (email == '') {
                        $('#'+form+' input[name=login-email]').addClass('f-error-fld');
                        error = error + errors[0];
                        eflag = false;
                    }
                    if (email != '') {
                        if (! emailrule.test(email)) {
                            $('#'+form+' input[name=login-email]').addClass('f-error-fld');
                            error = error + errors[2];
                            eflag = false;
                        }
                    }
                    if (pass == '') {
                        $('#'+form+' input[name=login-password]').addClass('f-error-fld');
                        error = error + errors[1];
                        eflag = false;
                    }
                    if (eflag == false) {
                        $('#'+form+' .f-error-msg').html(error).css('display','block');
                        return false;
                    }

                    $(jqForm).find('input').attr('disabled', 'true');
                    return true;
                },
                success: function(responseText) {
                    $('#'+form+' .f-error-msg').css('display','none');
                    $('#'+form+' input').removeClass('f-error-fld');

                    if (responseText.error != undefined) {
                        $('#'+form+' .f-error-msg').html(responseText.error).css('display','block');
                    }
                    if (responseText.fields != undefined) {
                        for (var i = 0; i < responseText.fields.length; i++) {
                            $('#'+form+' input[name='+responseText.fields[i]+']').addClass('f-error-fld');
                        }
                    }
                    if (responseText.redirect != undefined) {
                        // Unbind ajax form submit, and submit form
                        FormsModel.submitForm(form, responseText.redirect, false);
                    }
                    $('#'+form+' input').removeAttr('disabled');
                },
                error: function() {
                    $('#'+form+' .f-error-msg').html('Server error.').css('display','block');
                    $('#'+form+' input').removeClass('f-error-fld');
                    $('#'+form+' input').removeAttr('disabled');
                },
                dataType: 'json'
            });
            return false;
        });
    },
    initForgotForm: function(form, errors) {
        $('#'+form).submit(function() {
            $(this).ajaxSubmit({
                beforeSubmit: function(formData, jqForm, options) {
                    var email = $('#'+form+' input[name=forgot-email]').val();
                    if (email == '') {
                        $('#'+form+' .f-error-msg').html(errors[0]).css('display','block');
                        $('#'+form+' input[name=forgot-email]').addClass('f-error-fld');
                        return false;
                    }
                    var emailrule = new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9_-]+[\.][a-zA-Z0-9._-]+$');
                    if (! emailrule.test(email)) {
                        $('#'+form+' .f-error-msg').html(errors[1]).css('display','block');
                        $('#'+form+' input[name=forgot-email]').addClass('f-error-fld');
                        return false;
                    }
                    $(jqForm).find('input').attr('disabled', 'true');
                    return true;
                },
                success: function(responseText) {
                    $('#'+form+' .f-error-msg').css('display','none');
                    $('#'+form+' input').removeClass('f-error-fld');
                    
                    if (responseText.error != undefined) {
                        $('#'+form+' .f-error-msg').html(responseText.error).css('display','block');
                        $('#'+form+' input[name=forgot-email]').addClass('f-error-fld');
                    }
                    if (responseText.message != undefined) {
                        var section  = $('#'+form+' section');
                        $(section[0]).html(responseText.message);
                        $(section[1]).remove();
                        $(section[2]).remove();
                        $('#'+form+' footer').remove();
                    }
                    $('#'+form+' input').removeAttr('disabled');
                },
                error: function() {
                    $('#'+form+' .f-error-msg').html('Server error.').css('display','block');
                    $('#'+form+' input').removeClass('f-error-fld');
                    $('#'+form+' input').removeAttr('disabled');
                },
                dataType: 'json'
            });
            return false;
        });
    },
    redirect: function(redirect) {
        if (redirect != '') {
            redirect = redirect + '.'
        }
        if (document.location.host.substr(0,4) == 'www.') {
            var path = document.location.host.substr(4,document.location.host.length);
            document.location.href = document.location.protocol+'//www.'+redirect+path+'/';
        }
        else {
            document.location.href = document.location.protocol+'//'+redirect+document.location.host+'/';
        }
        return true;
    },
    submitForm: function(form, redirect, www) {
        $('#'+form).unbind('submit');

        if (redirect != '') {
            redirect = redirect + '.'
        }
        
        if (www == true && document.location.host.substr(0,4) == 'www.') {
            var path = document.location.host.substr(4,document.location.host.length);
            redirect = document.location.protocol+'//'+redirect+path+'/';
        }
        else if (www == false && document.location.host.substr(0,4) == 'www.') {
            var path = document.location.host.substr(4,document.location.host.length);
            redirect = document.location.protocol+'//'+redirect+path+'/';
        }
        else {
            redirect = document.location.protocol+'//'+redirect+document.location.host+'/';
        }

        $('#'+form).attr('action', redirect);
        $('#'+form).submit();
    },
    submitPreloader: function(form, button, preloader, validation, step){
        $('#'+button).click(function() {
            if(validation.validate() == true) {
                $(this).hide();
                $('#'+preloader).show();
                $('#button-diable').show();
            }
            else {
                $(this).removeAttr('disabled');
                $(this).show();
                $('#'+preloader).hide();
                $('#button-diable').hide();
            }
        });
    }
}
