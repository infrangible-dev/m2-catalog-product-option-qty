<?php

declare(strict_types=1);

namespace Infrangible\CatalogProductOptionQty\Plugin\Quote\Model\Quote\Item;

use Magento\Quote\Model\Quote\Address\Item as AddressItem;
use Magento\Quote\Model\Quote\Item;

/**
 * @author      Andreas Knollmann
 * @copyright   2014-2025 Softwareentwicklung Andreas Knollmann
 * @license     http://www.opensource.org/licenses/mit-license.php MIT
 */
class ToOrderItem
{
    /**
     * @param Item|AddressItem $item
     *
     * @noinspection PhpUnusedParameterInspection
     */
    public function beforeConvert(Item\ToOrderItem $subject, $item, $data = []): array
    {
        $parentItem = $item->getParentItem();

        if ($parentItem) {
            $itemProduct = $item->getProduct();
            $parentItemProduct = $parentItem->getProduct();

            $itemProduct->setData(
                'parent_item_product',
                $parentItemProduct
            );
        }

        return [$item, $data];
    }
}
