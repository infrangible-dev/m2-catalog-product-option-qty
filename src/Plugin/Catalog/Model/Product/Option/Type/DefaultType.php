<?php

declare(strict_types=1);

namespace Infrangible\CatalogProductOptionQty\Plugin\Catalog\Model\Product\Option\Type;

use Magento\Quote\Model\Quote\Item\Option;

/**
 * @author      Andreas Knollmann
 * @copyright   2014-2025 Softwareentwicklung Andreas Knollmann
 * @license     http://www.opensource.org/licenses/mit-license.php MIT
 */
class DefaultType
{
    public function afterGetOptionPrice(
        \Magento\Catalog\Model\Product\Option\Type\DefaultType $subject,
        float $result
    ): float {
        /** @var Option $itemOption */
        $itemOption = $subject->getData('configuration_item_option');

        if ($itemOption) {
            $optionQty = $itemOption->getItem()->getOptionByCode($itemOption->getCode() . '_qty');

            if ($optionQty) {
                $result *= $optionQty->getValue();
            }
        }

        return $result;
    }
}
