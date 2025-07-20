<?php

declare(strict_types=1);

namespace Infrangible\CatalogProductOptionQty\Helper;

use FeWeDev\Base\Arrays;
use FeWeDev\Base\Json;
use FeWeDev\Base\Variables;
use Magento\Catalog\Api\Data\CustomOptionExtension;
use Magento\Catalog\Api\Data\CustomOptionExtensionFactory;
use Magento\Catalog\Api\Data\ProductOptionExtension;
use Magento\Catalog\Model\CustomOptions\CustomOption;
use Magento\Catalog\Model\Product;
use Magento\Catalog\Model\Product\Option;
use Magento\Sales\Api\Data\OrderInterface;
use Magento\Sales\Model\Order\Item;

/**
 * @author      Andreas Knollmann
 * @copyright   2014-2025 Softwareentwicklung Andreas Knollmann
 * @license     http://www.opensource.org/licenses/mit-license.php MIT
 */
class Data
{
    /** @var Variables */
    protected $variables;

    /** @var Json */
    protected $json;

    /** @var Arrays */
    protected $arrays;

    /** @var CustomOptionExtensionFactory */
    protected $customOptionExtensionFactory;

    public function __construct(
        Variables $variables,
        Json $json,
        Arrays $arrays,
        CustomOptionExtensionFactory $customOptionExtensionFactory
    ) {
        $this->variables = $variables;
        $this->json = $json;
        $this->arrays = $arrays;
        $this->customOptionExtensionFactory = $customOptionExtensionFactory;
    }

    public function getOptionsConfig(Product $product): string
    {
        $config = [];

        /** @var Option $option */
        foreach ($product->getOptions() as $option) {
            $optionQty = $option->getData('qty');

            if ($optionQty) {
                $optionQtySteps = $option->getData('qty_steps');

                if ($optionQtySteps) {
                    if (! $option->getIsRequire()) {
                        $qtyNoneText = $option->getData('qty_none_text');

                        $qtyNoneText = $this->variables->isEmpty($qtyNoneText) ? 'None' : $qtyNoneText;

                        $config[ $option->getId() ][ 'steps' ][] = ['value' => 0, 'label' => __($qtyNoneText)];
                    }

                    $steps = explode(
                        ',',
                        $optionQtySteps
                    );

                    foreach ($steps as $step) {
                        $config[ $option->getId() ][ 'steps' ][] = ['value' => $step, 'label' => $step];
                    }
                } else {
                    $config[ $option->getId() ][ 'input' ] = 1;
                }

                $config[ $option->getId() ][ 'sync' ] = $option->getData('qty_sync') == 1;
                $config[ $option->getId() ][ 'select2' ] = $option->getData('qty_select2') == 1;
            }
        }

        return $this->json->encode($config);
    }

    public function addProductOptionQtyToOrder(OrderInterface $order)
    {
        foreach ($order->getItems() as $item) {
            if ($item instanceof Item) {
                $this->addProductOptionQtyToOrderItem($item);
            }
        }

        $shippingAssignments = $order->getExtensionAttributes()->getShippingAssignments();

        foreach ($shippingAssignments as $shippingAssignment) {
            foreach ($shippingAssignment->getItems() as $item) {
                if ($item instanceof Item) {
                    $this->addProductOptionQtyToOrderItem($item);
                }
            }
        }
    }

    public function addProductOptionQtyToOrderItem(Item $item): void
    {
        $itemProductOptions = $item->getProductOptions();

        $itemProductOptionsOptions = $this->arrays->getValue(
            $itemProductOptions,
            'options',
            []
        );

        foreach ($itemProductOptionsOptions as $itemProductOptionsOption) {
            $itemProductOptionsOptionId = $this->arrays->getValue(
                $itemProductOptionsOption,
                'option_id'
            );

            /** @var Option $productOptionData */
            $productOptionData = $item->getProductOption();

            /** @var ProductOptionExtension $productOptionDataAttributes */
            $productOptionDataAttributes = $productOptionData->getExtensionAttributes();

            $customOptions = $productOptionDataAttributes->getCustomOptions();

            /** @var CustomOption $customOption */
            foreach ($customOptions as $customOption) {
                if ($customOption->getOptionId() == $itemProductOptionsOptionId) {
                    /** @var CustomOptionExtension $customOptionExtensionAttributes */
                    $customOptionExtensionAttributes = $customOption->getExtensionAttributes();

                    $customOptionExtensionAttributes =
                        $customOptionExtensionAttributes ? : $this->customOptionExtensionFactory->create();

                    $itemProductOptionsOptionQty = $this->arrays->getValue(
                        $itemProductOptionsOption,
                        'option_qty'
                    );
                    if ($itemProductOptionsOptionQty !== null) {
                        $customOptionExtensionAttributes->setQty(floatval($itemProductOptionsOptionQty));
                    }

                    $customOption->setExtensionAttributes($customOptionExtensionAttributes);
                }
            }
        }
    }
}
