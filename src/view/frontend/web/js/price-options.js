/**
 * @author      Andreas Knollmann
 * @copyright   Copyright (c) 2014-2025 Softwareentwicklung Andreas Knollmann
 * @license     http://www.opensource.org/licenses/mit-license.php MIT
 */

define([
    'jquery',
    'underscore',
    'priceUtils',
    'Magento_Catalog/js/price-options',
    'productOptionsQty',
    'mage/translate'
], function ($, _, utils) {
    'use strict';

    function defaultGetOptionValue(element, optionsConfig) {
        var changes = {},
            optionValue = element.val(),
            optionId = utils.findOptionId(element[0]),
            optionName = element.prop('name'),
            optionType = element.prop('type'),
            optionConfig = optionsConfig[optionId],
            optionHash = optionName;

        switch (optionType) {
            case 'radio':
                if (element.is(':checked')) {
                    changes[optionHash] = optionConfig[optionValue] && optionConfig[optionValue].prices || {};
                }
                break;

            case 'select-one':
                changes[optionHash] = optionConfig[optionValue] && optionConfig[optionValue].prices || {};
                break;

            case 'select-multiple':
                _.each(optionConfig, function (row, optionValueCode) {
                    optionHash = optionName + '##' + optionValueCode;
                    changes[optionHash] = _.contains(optionValue, optionValueCode) ? row.prices : {};
                });
                break;

            case 'checkbox':
                optionHash = optionName + '##' + optionValue;
                changes[optionHash] = element.is(':checked') ? optionConfig[optionValue].prices : {};
                break;

            default:
                console.error('Unsupported option type: "' + optionType + '"');
                break;
        }

        return changes;
    }

    $.widget('infrangible.priceOptions', $.mage.priceOptions, {
        _create: function createPriceOptions() {
            this._super();

            this.options.optionHandlers.qty = this.getQtyHandler();
        },

        getQtyHandler: function getQtyHandler() {
            var self = this;

            return function (element, optionConfig) {
                var changes = defaultGetOptionValue(element, optionConfig);

                var optionId = utils.findOptionId(element[0]);
                var qty = $('#options_qty_' + optionId);

                if (qty.length > 0) {
                    var qtyValue = qty.val();
                    var finalPrice = 0;

                    $.each(changes, function(key, prices) {
                        $.each(prices, function(price, priceData) {
                            if (priceData.orgAmount) {
                                priceData.amount = priceData.orgAmount * qtyValue;
                            } else if (priceData.amount) {
                                priceData.orgAmount = priceData.amount;
                                priceData.amount = priceData.amount * qtyValue;
                            }

                            if (price === 'finalPrice') {
                                finalPrice = priceData.amount;
                            }
                        });
                    });

                    self.removeOptionPrice(element);

                    if (finalPrice > 0) {
                        self.addOptionPrice(optionId, finalPrice);
                    }
                }

                return changes;
            };
        },

        removeOptionPrice: function removeOptionPrice(element) {
            $(element).closest('.field-wrapper').find('.product-option-qty-price').remove();
        },

        addOptionPrice: function addOptionPrice(optionId, finalPrice) {
            var control = $('div[data-option-id="' + optionId + '"] > div.field > div.control');
            if (control.length > 0) {
                var priceField = $('<div>', {class: 'product-option-qty-price'});
                control.append(priceField);

                var priceFieldLabel = $('<label>', {class: 'label'});
                priceFieldLabel.html($.mage.__('Your selection'));
                priceField.append(priceFieldLabel);

                var priceFieldPriceContainer = $('<span>', {
                    class: 'price-container price-final_price'
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
            }
        }
    });

    return $.infrangible.priceOptions;
});
