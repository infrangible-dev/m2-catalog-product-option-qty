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

            domReady(function() {
                $.each(self.options.options, function(optionId, qtyType) {
                    var control = $('div[data-option-id="' + optionId + '"] > div.field > div.control');

                    if (control.length > 0) {
                        var qtyField = $('<div>', {class: 'field qty'});
                        control.before(qtyField);

                        var label = $('<label>', {class: 'label', for: 'qty'});
                        qtyField.append(label);

                        var labelLabel = $('<span>');
                        labelLabel.html($.mage.__('Qty'));
                        label.append(labelLabel);

                        var qtyControl = $('<div>', {class: 'control'});
                        qtyField.append(qtyControl);

                        if (qtyType.input) {
                            var qtyInput = $('<input>', {
                                type: 'number',
                                name: 'options_qty[' + optionId + ']',
                                id: 'options_qty_' + optionId,
                                class: 'input-text qty product-option-qty',
                                value: qtyType.input,
                                title: $.mage.__('Qty'),
                                min: 1,
                                'data-validate': '{&quot;required-number&quot;:true,&quot;validate-item-quantity&quot;:{&quot;maxAllowed&quot;:10000}}'
                            });
                            qtyControl.append(qtyInput);

                            qtyInput.bind('keyup mouseup', function() {
                                $(this).closest('.field-wrapper').find('.product-custom-option').trigger('change');
                            });
                        } else if (qtyType.steps) {
                            var qtySelect = $('<select>', {
                                name: 'options_qty[' + optionId + ']',
                                id: 'options_qty_' + optionId,
                                class: 'admin__control-select product-option-qty',
                                title: $.mage.__('Qty')
                            });
                            qtyControl.append(qtySelect);

                            $.each(qtyType.steps, function(key, step) {
                                var option = $('<option>', {
                                    value: step.value,
                                    title: step.label
                                });
                                option.html(step.label);
                                qtySelect.append(option);
                            });

                            qtySelect.bind('change', function() {
                                $(this).closest('.field-wrapper').find('.product-custom-option').trigger('change');
                            });
                        }
                    }
                });
            });
        }
    });

    return $.mage.productOptionsQty;
});
