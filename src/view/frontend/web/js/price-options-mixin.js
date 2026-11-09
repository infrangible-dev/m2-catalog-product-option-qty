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
                const self = this;

                return function (element, optionConfig) {
                    const changes = self.getOptionValue(element, optionConfig);

                    const optionId = utils.findOptionId(element[0]);
                    const qty = $('#options_qty_' + optionId);

                    if (qty.length > 0) {
                        $.each(changes, function(key, prices) {
                            if (! self.cache[optionId]) {
                                self.cache[optionId] = {};
                            }
                            self.cache[optionId][key] = prices;
                        });

                        const qtyValue = qty.val();
                        let finalPrice = 0;
                        let unitPrice = 0;

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
                const control = $('div[data-option-id="' + optionId + '"] > div.field > div.control');
                if (control.length > 0) {
                    control.find('.product-option-qty-price').remove();
                    control.find('.unit-price-hint').remove();

                    const qty = control.find('.field.qty.unit');
                    if (qty.length > 0) {
                        const select = qty.find('select');
                        if (select.length > 0) {
                            const select2 = qty.find('.select2-container .selection .select2-selection .select2-selection__rendered');
                            if (select2.length > 0) {
                                select2.text(select2.attr('title'));
                            }
                        }
                    }
                }
            },

            addOptionPrice: function addOptionPrice(optionId, finalPrice, unitPrice) {
                const self = this;

                const control = $('div[data-option-id="' + optionId + '"] > div.field > div.control');
                if (control.length > 0) {
                    const priceField = $('<div>', {class: 'product-option-qty-price'});
                    control.append(priceField);

                    const priceFieldLabel = $('<label>', {class: 'label'});
                    priceFieldLabel.html($.mage.__('Your selection'));
                    priceField.append(priceFieldLabel);

                    const priceFieldPriceContainer = $('<span>', {
                        class: 'price-container price-option_price'
                    });
                    priceField.append(priceFieldPriceContainer);

                    const priceFieldPriceWrapper = $('<span>', {
                        class: 'price-wrapper'
                    });
                    priceFieldPriceContainer.append(priceFieldPriceWrapper);

                    const priceFieldPriceValue = $('<span>', {
                        class: 'price'
                    });
                    priceFieldPriceValue.html(utils.formatPrice(finalPrice, this.options.priceFormat));
                    priceFieldPriceWrapper.append(priceFieldPriceValue);

                    const qty = control.find('.field.qty.unit');
                    if (qty.length > 0) {
                        const config = self.options,
                            format = config.priceFormat;

                        let addUnitPrice = true;

                        const select = qty.find('select');
                        if (select.length > 0) {
                            select.attr('data-unit-price', unitPrice);

                            const select2 = qty.find('.select2-container .selection .select2-selection .select2-selection__rendered');

                            if (select2.length > 0) {
                                select2.text(select2.attr('title') +
                                    ' (' + utils.formatPriceLocale(unitPrice, format) + ' / ' + $.mage.__('QtyItem') + ')');

                                addUnitPrice = false;
                            }
                        }

                        if (addUnitPrice) {
                            let unitPriceHint = qty.find('.unit-price-hint');

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
