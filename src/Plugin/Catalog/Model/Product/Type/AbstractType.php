<?php

declare(strict_types=1);

namespace Infrangible\CatalogProductOptionQty\Plugin\Catalog\Model\Product\Type;

use FeWeDev\Base\Variables;
use Magento\Catalog\Model\Product;
use Magento\Framework\DataObject;
use Magento\Quote\Model\Quote\Item\Option;

/**
 * @author      Andreas Knollmann
 * @copyright   2014-2025 Softwareentwicklung Andreas Knollmann
 * @license     http://www.opensource.org/licenses/mit-license.php MIT
 */
class AbstractType
{
    /** @var Variables */
    protected $variables;

    public function __construct(Variables $variables)
    {
        $this->variables = $variables;
    }

    public function afterPrepareForCartAdvanced(
        Product\Type\AbstractType $subject,
        $result,
        DataObject $buyRequest
    ) {
        if (is_array($result)) {
            /** @var Product $product */
            foreach ($result as $product) {
                $optionQtys = $buyRequest->getData('options_qty');

                if (is_array($optionQtys)) {
                    /** @var Option $optionIds */
                    $optionIds = $product->getCustomOption('option_ids');

                    if ($optionIds && ! $this->variables->isEmpty($optionIds->getValue())) {
                        $optionIdValues = explode(
                            ',',
                            $optionIds->getValue()
                        );

                        foreach ($optionIdValues as $key => $optionId) {
                            if (array_key_exists(
                                $optionId,
                                $optionQtys
                            )) {
                                $optionQty = $optionQtys[ $optionId ];

                                $optionKey = sprintf(
                                    '%s%s',
                                    $subject::OPTION_PREFIX,
                                    $optionId
                                );

                                if ($optionQty < 0.001) {
                                    unset($optionIdValues[ $key ]);

                                    if (count($optionIdValues) > 0) {
                                        $optionIds->setValue(
                                            implode(
                                                ',',
                                                $optionIdValues
                                            )
                                        );
                                    } else {
                                        $customOptions = $product->getCustomOptions();

                                        if (array_key_exists(
                                            'option_ids',
                                            $customOptions
                                        )) {
                                            unset($customOptions[ 'option_ids' ]);
                                        }

                                        $product->setCustomOptions($customOptions);
                                    }

                                    $customOptions = $product->getCustomOptions();

                                    if (array_key_exists(
                                        $optionKey,
                                        $customOptions
                                    )) {
                                        unset($customOptions[ $optionKey ]);
                                    }

                                    $product->setCustomOptions($customOptions);
                                } else {
                                    $product->addCustomOption(
                                        sprintf(
                                            '%s%s',
                                            $optionKey,
                                            '_qty'
                                        ),
                                        $optionQty
                                    );
                                }
                            }
                        }
                    }
                }
            }
        }

        return $result;
    }

    public function afterGetOrderOptions(
        Product\Type\AbstractType $subject,
        array $result,
        Product $product
    ): array {
        if (array_key_exists(
            'options',
            $result
        )) {
            foreach ($result[ 'options' ] as $key => $option) {
                if (array_key_exists(
                    'option_id',
                    $option
                )) {
                    $optionId = $option[ 'option_id' ];

                    $optionQty = $product->getCustomOption(
                        sprintf(
                            '%s%s_qty',
                            $subject::OPTION_PREFIX,
                            $optionId
                        )
                    );

                    if ($optionQty) {
                        $optionQtyValue = $optionQty->getValue();

                        if ($optionQtyValue) {
                            $result[ 'options' ][ $key ][ 'option_qty' ] = $optionQtyValue;
                        }
                    }
                }
            }
        }

        return $result;
    }
}
