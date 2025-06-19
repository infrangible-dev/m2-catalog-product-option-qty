/**
 * @author      Andreas Knollmann
 * @copyright   Copyright (c) 2014-2025 Softwareentwicklung Andreas Knollmann
 * @license     http://www.opensource.org/licenses/mit-license.php MIT
 */

define([
    'jquery',
    'domReady',
    'mage/translate'
], function ($, domReady) {
    'use strict';

    var globalOptions = {
        options: {}
    };

    $.widget('mage.productOptionsQty', {
        options: globalOptions,

        _create: function createProductOptionsQty() {
        },

        _init: function initProductOptionsQty() {
            var self = this;
            var qtyNode = $('#product_addtocart_form .box-tocart .field.qty #qty');

            domReady(function() {
                $.each(self.options.options, function(optionId, qtyData) {
                    var control = $('div[data-option-id="' + optionId + '"] > div.field > div.control');

                    if (control.length > 0) {
                        var qtyField = $('<div>', {class: 'field qty'});
                        control.prepend(qtyField);

                        var label = $('<label>', {class: 'label', for: 'qty'});
                        qtyField.append(label);

                        var labelLabel = $('<span>');
                        labelLabel.html($.mage.__('Qty'));
                        label.append(labelLabel);

                        var qtyControl = $('<div>', {class: 'control'});
                        qtyField.append(qtyControl);

                        if (qtyData.input) {
                            var qtyInput = $('<input>', {
                                type: 'number',
                                name: 'options_qty[' + optionId + ']',
                                id: 'options_qty_' + optionId,
                                class: 'input-text qty product-option-qty',
                                value: qtyData.input,
                                title: $.mage.__('Qty'),
                                min: 1,
                                'data-validate': '{&quot;required-number&quot;:true,&quot;validate-item-quantity&quot;:{&quot;maxAllowed&quot;:10000}}',
                                'data-sync': true
                            });
                            qtyControl.append(qtyInput);

                            qtyInput.bind('keyup mouseup sync', function() {
                                $(this).closest('.field-wrapper').find('.product-custom-option').trigger('change');
                            });

                            qtyInput.bind('keyup mouseup', function() {
                                qtyInput.data('sync', false);
                            });

                            if (qtyData.sync) {
                                qtyNode.on('input', function() {
                                    if (qtyInput.data('sync') === true) {
                                        var qty = $(this).val();

                                        qtyInput.val(qty);
                                        qtyInput.trigger('sync');
                                    }
                                });
                            }
                        } else if (qtyData.steps) {
                            var qtySelect = $('<select>', {
                                name: 'options_qty[' + optionId + ']',
                                id: 'options_qty_' + optionId,
                                class: 'admin__control-select product-option-qty',
                                title: $.mage.__('Qty'),
                                'data-sync': true
                            });
                            qtyControl.append(qtySelect);

                            $.each(qtyData.steps, function(key, step) {
                                var option = $('<option>', {
                                    value: step.value,
                                    title: step.label
                                });
                                option.html(step.label);
                                qtySelect.append(option);
                            });

                            qtySelect.bind('change sync', function() {
                                $(this).closest('.field-wrapper').find('.product-custom-option').trigger('change');
                            });

                            qtySelect.bind('change', function() {
                                qtySelect.data('sync', false);
                            });

                            if (qtyData.sync) {
                                qtyNode.on('input', function() {
                                    if (qtySelect.data('sync') === true) {
                                        var qty = $(this).val();

                                        qtySelect.find('option').each(function() {
                                            if ($(this).val() === qty) {
                                                qtySelect.val(qty);
                                                qtySelect.trigger('change');
                                            }
                                        });
                                    }
                                });
                            }
                        }

                        control.find('select.product-custom-option, input.product-custom-option').each(function() {
                            $(this).attr('data-role', 'qty');
                        });
                   }
                });
            });
        }
    });

    return $.mage.productOptionsQty;
});
