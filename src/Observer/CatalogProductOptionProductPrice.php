<?php

declare(strict_types=1);

namespace Infrangible\CatalogProductOptionQty\Observer;

use Magento\Catalog\Model\Product;
use Magento\Framework\DataObject;
use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;

/**
 * @author      Andreas Knollmann
 * @copyright   2014-2025 Softwareentwicklung Andreas Knollmann
 * @license     http://www.opensource.org/licenses/mit-license.php MIT
 */
class CatalogProductOptionProductPrice implements ObserverInterface
{
    /**
     * @throws \Exception
     */
    public function execute(Observer $observer): void
    {
        /** @var DataObject $transportObject */
        $transportObject = $observer->getData('data');

        /** @var Product $product */
        $product = $transportObject->getData('product');

        /** @var Product\Option $option */
        $option = $transportObject->getData('option');

        $price = $transportObject->getData('price');

        $customOption = $product->getCustomOption(
            sprintf(
                'option_%s_qty',
                $option->getId()
            )
        );

        if ($customOption) {
            $transportObject->setData(
                'price',
                $price * $customOption->getValue()
            );
        }
    }
}
