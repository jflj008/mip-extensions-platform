/**
 * @file mip-hs-login 组件
 * @author
 */

define(function (require) {
    'use strict';
    var $ = require('zepto');
    var customElement = require('customElement').create();

    /**
	 * 第一次进入可视区回调，只会执行一次
	 */
    customElement.prototype.firstInviewCallback = function () {
        var $el = $(this.element);
        var $form = $el.find('form');

        function closearticle($modelbg, $model) {
            $modelbg.fadeOut(300);
            $model.fadeOut(300);
        }

        function openarticle($modelbg, $model, $text) {
            $el.find('.text').text($text);
            $modelbg.fadeIn(300);
            $model.fadeIn(300);
        }

        function openAlart($showtext, callback) {
            $el.find('.qx_close').show();
            openarticle($el.find('.model_bg'), $el.find('.article_model'), $showtext);
            if (callback) {
                $el.find('.article_close').click(function () {
                    closearticle($el.find('.model_bg'), $el.find('.article_model'));
                    callback();
                });
            }
        }

        $el.find('.article_close').click(function () {
            closearticle($el.find('.model_bg'), $el.find('.article_model'));
            $el.find('.qx_close').fadeOut(300);
        });
        $el.find('.qx_close').click(function () {
            closearticle($el.find('.model_bg'), $el.find('.article_model'));
            $el.find('.qx_close').fadeOut(300);
        });

        $form.on('keydown', function (e) {
            console.log('111');
            var keycode = e.keyCode;
            var $phone = $el.find('.telphone');
            var $pass = $el.find('.passText');
            var $code = $el.find('.input_idf');
            if (keycode === 13 || keycode === 9) {
                e.preventDefault();
                submitgo();
                $phone.blur();
                $pass.blur();
                $code.blur();
                return false;
            }

        });

        var ajaxurl = $el.attr('data-url');
        $el.find('.login').click(function () {
            submitgo();
        });
        function submitgo() {
            var phone = $.trim($el.find('.telphone').val());
            var pass = $.trim($el.find('.passText').val());
            var code = $.trim($el.find('.input_idf').val());
            var remember = '';
            if ($el.find('.check').hasClass('checkbox')) {
                remember = true;
            }

            $.ajax({
                type: 'POST',
                url: ajaxurl,
                cache: false,
                data: 'account=' + phone + '&password=' + pass + '&code=' + code
                    + '&remember=' + remember + '&t=' + Math.random(),
                dataType: 'json',
                async: false,
                success: function (data) {
                    if (data.status === 1) {
                        openarticle($el.find('.model_bg'), $el.find('.article_model'), data.msg);
                        //                      $el.find('.error').html(data.msg);
                        var Url = '/captcha';
                        Url = Url + '/' + Math.random();
                        $el.find('.idf_img_show').attr('src', Url);
                    }

                    if (data.status === 0) {
                        if (data.data.close === true) {
                            window.close();
                        }
                        else {
                            window.location.href = data.data.url;
                        }
                    }

                },
                error: function (e) {
                    openarticle($el.find('.model_bg'), $el.find('.article_model'), '登录出错');
                    //                  $el.find('.error').html('登录出错');
                    return;
                }
            });
        }
        $el.find('.idf_img_show').on('click', function () {
            var Url = '/captcha';
            Url = Url + '/' + Math.random();
            $(this).attr('src', Url);
        });
        $el.find('.check').on('click', function () {
            if ($(this).hasClass('checked')) {
                $(this).removeClass('checked');
            }
            else {
                $(this).addClass('checked');
            }
        });
    };

    return customElement;
});
