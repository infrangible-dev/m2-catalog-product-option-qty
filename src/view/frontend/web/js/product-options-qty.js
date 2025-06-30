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
                self.initialElement($(self.element));
            });
        },

        initialElement: function(element) {
            var self = this;
            var qtyNode = $('#product_addtocart_form .box-tocart .field.qty #qty');

            $.each(self.options.options, function(optionId, qtyData) {
                var control = element.find('div[data-option-id="' + optionId + '"] > div.field > div.control');

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
                                self.syncQtyInput($(this), qtyInput);
                            });
                            self.syncQtyInput(qtyNode, qtyInput);
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
                            self.syncQtySelect(qtyNode, qtySelect);
                            qtyNode.on('input', function() {
                                self.syncQtySelect($(this), qtySelect);
                            });
                        }
                    }

                    control.find('select.product-custom-option, input.product-custom-option').each(function() {
                        $(this).attr('data-role', 'qty');
                    });
                }
            });
        },

        syncQtyInput: function(qty, qtyInput) {
            if (qtyInput.data('sync') === true) {
                var qtyValue = qty.val();

                qtyInput.val(qtyValue);
                qtyInput.trigger('sync');
            }
        },

        syncQtySelect: function(qty, qtySelect) {
            if (qtySelect.data('sync') === true) {
                var qtyValue = qty.val();

                qtySelect.find('option').each(function() {
                    if ($(this).val() === qtyValue) {
                        qtySelect.val(qtyValue);
                        qtySelect.trigger('sync');
                    }
                });
            }
        }
    });

    return $.mage.productOptionsQty;
});
