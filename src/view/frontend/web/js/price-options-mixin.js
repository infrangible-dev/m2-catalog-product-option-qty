/**
 * @author      Andreas Knollmann
 * @copyright   2014-2025 Softwareentwicklung Andreas Knollmann
 * @license     http://www.opensource.org/licenses/mit-license.php MIT
 */

define([
    'jquery',
    'underscore',
    'priceUtils',
    'mage/translate'
], function ($, _, utils) {
    'use strict';

    return function (widget) {
        $.widget('infrangible.priceOptions', widget, {
            _create: function createPriceOptions() {
                this._super();

                this.options.optionHandlers.qty = this.getQtyHandler();
                this.cache = {};
            },

            getQtyHandler: function getQtyHandler() {
                var self = this;

                return function (element, optionConfig) {
                    var changes = self.getOptionValue(element, optionConfig);

                    var optionId = utils.findOptionId(element[0]);
                    var qty = $('#options_qty_' + optionId);

                    if (qty.length > 0) {
                        $.each(changes, function(key, prices) {
                            if (! self.cache[optionId]) {
                                self.cache[optionId] = {};
                            }
                            self.cache[optionId][key] = prices;
                        });

                        var qtyValue = qty.val();
                        var finalPrice = 0;
                        var unitPrice = 0;

                        $.each(self.cache[optionId], function(key, prices) {
                            $.each(prices, function(price, priceData) {
                                if (priceData.orgAmount) {
                                    priceData.amount = priceData.orgAmount * qtyValue;
                                } else if (priceData.amount) {
                                    priceData.orgAmount = priceData.amount;
                                    priceData.amount = priceData.amount * qtyValue;
                                }

                                if (price === 'finalPrice') {
                                    finalPrice = finalPrice + priceData.amount;
                                    unitPrice = unitPrice + priceData.orgAmount;
                                }
                            });
                        });

                        self.removeOptionPrice(optionId);

                        if (finalPrice > 0) {
                            self.addOptionPrice(optionId, finalPrice, unitPrice);
                        }
                    }

                    return changes;
                };
            },

            removeOptionPrice: function removeOptionPrice(optionId) {
                var control = $('div[data-option-id="' + optionId + '"] > div.field > div.control');
                if (control.length > 0) {
                    control.find('.product-option-qty-price').remove();
                    control.find('.unit-price-hint').remove();

                    var qty = control.find('.field.qty.unit');
                    if (qty.length > 0) {
                        var select = qty.find('select');
                        if (select.length > 0) {
                            var select2 = qty.find('.select2-container .selection .select2-selection .select2-selection__rendered');
                            if (select2.length > 0) {
                                select2.text(select2.attr('title'));
                            }
                        }
                    }
                }
            },

            addOptionPrice: function addOptionPrice(optionId, finalPrice, unitPrice) {
                var self = this;

                var control = $('div[data-option-id="' + optionId + '"] > div.field > div.control');
                if (control.length > 0) {
                    var priceField = $('<div>', {class: 'product-option-qty-price'});
                    control.append(priceField);

                    var priceFieldLabel = $('<label>', {class: 'label'});
                    priceFieldLabel.html($.mage.__('Your selection'));
                    priceField.append(priceFieldLabel);

                    var priceFieldPriceContainer = $('<span>', {
                        class: 'price-container price-option_price'
                    });
                    priceField.append(priceFieldPriceContainer);

                    var priceFieldPriceWrapper = $('<span>', {
                        class: 'price-wrapper'
                    });
                    priceFieldPriceContainer.append(priceFieldPriceWrapper);

                    var priceFieldPriceValue = $('<span>', {
                        class: 'price'
                    });
                    priceFieldPriceValue.html(utils.formatPrice(finalPrice, this.options.priceFormat));
                    priceFieldPriceWrapper.append(priceFieldPriceValue);

                    var qty = control.find('.field.qty.unit');
                    if (qty.length > 0) {
                        var config = self.options,
                            format = config.priceFormat;

                        var addUnitPrice = true;

                        var select = qty.find('select');
                        if (select.length > 0) {
                            select.attr('data-unit-price', unitPrice);

                            var select2 = qty.find('.select2-container .selection .select2-selection .select2-selection__rendered');

                            if (select2.length > 0) {
                                select2.text(select2.attr('title') +
                                    ' (' + utils.formatPriceLocale(unitPrice, format) + ' / ' + $.mage.__('QtyItem') + ')');

                                addUnitPrice = false;
                            }
                        }

                        if (addUnitPrice) {
                            var unitPriceHint = qty.find('.unit-price-hint');

                            if (unitPriceHint.length === 0) {
                                unitPriceHint = $('<span>', {class: 'unit-price-hint'});
                                qty.append(unitPriceHint);
                            }

                            unitPriceHint.text(utils.formatPriceLocale(unitPrice, format) + ' / ' + $.mage.__('QtyItem'));
                        }
                    }
                }
            }
        });

        return $.infrangible.priceOptions;
    };
});
