/**
 * @author      Andreas Knollmann
 * @copyright   Copyright (c) 2014-2025 Softwareentwicklung Andreas Knollmann
 * @license     http://www.opensource.org/licenses/mit-license.php MIT
 */

define([
    'jquery',
    'domReady',
    'priceUtils',
    'mage/translate',
    'Infrangible_Select2/js/select2'
], function ($, domReady, utils) {
    'use strict';

    var globalOptions = {
        options: {},
        priceFormat: {}
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
                    if (qtyData.unit) {
                        qtyField.addClass('unit');
                    }
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

                        qtySelect.bind('change', function(event) {
                            if (! event.isTrigger) {
                                qtySelect.data('sync', false);
                            }
                        });

                        var qtySelect2;
                        if (qtyData.select2) {
                            qtySelect2 = qtySelect.select2({
                                dropdownParent: qtySelect.parent(),
                                dropdownCssClass: 'product-option-qty',
                                minimumResultsForSearch: Infinity,
                                width: 'auto'
                            });

                            if (qtyData.unit) {
                                qtySelect.on('select2:selecting', function(event) {
                                    qtySelect.data('sync', false);
                                });

                                qtySelect.on('select2:select', function () {
                                    var select = $(this);
                                    var unitPrice = select.attr('data-unit-price');

                                    if (unitPrice) {
                                        var format = self.options.priceFormat;

                                        var select2 = select.parent().find('.select2-container .selection .select2-selection .select2-selection__rendered');
                                        var title = select2.attr('title');

                                        if (! isNaN(title)) {
                                            select2.text(select2.attr('title') +
                                                ' (' +
                                                utils.formatPriceLocale(unitPrice, format) +
                                                ' / ' +
                                                $.mage.__('QtyItem') +
                                                ')');
                                        }
                                    }
                                });
                            }
                        }

                        if (qtyData.sync) {
                            self.syncQtySelect(qtyNode, qtySelect, qtySelect2);
                            qtyNode.on('input', function() {
                                self.syncQtySelect($(this), qtySelect, qtySelect2);
                            });
                        }
                    }

                    control.find('select.product-custom-option, input.product-custom-option').each(function() {
                        $(this).removeData('role');
                        $(this).attr('data-role', 'qty');
                    });
                }
            });
        },

        select2ResultState: function(data, container) {
            if(data.element) {
                $(container).addClass($(data.element).attr("class"));
            }
            return data.text;
        },

        syncQtyInput: function(qty, qtyInput) {
            if (qtyInput.data('sync') === true) {
                var qtyValue = qty.val();

                qtyInput.val(qtyValue);
                qtyInput.trigger('sync');
            }
        },

        syncQtySelect: function(qty, qtySelect, qtySelect2) {
            if (qtySelect.data('sync') === true) {
                var qtyValue = qty.val();

                qtySelect.find('option').each(function() {
                    if ($(this).val() === qtyValue) {
                        qtySelect.val(qtyValue);
                        qtySelect.trigger('sync');
                    }
                });

                if (qtySelect2) {
                    qtySelect2.val(qtyValue);
                    qtySelect2.trigger('change');
                }
            }
        }
    });

    return $.mage.productOptionsQty;
});
