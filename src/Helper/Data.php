<?php

declare(strict_types=1);

namespace Infrangible\CatalogProductOptionQty\Helper;

use FeWeDev\Base\Json;
use FeWeDev\Base\Variables;
use Magento\Catalog\Model\Product;
use Magento\Catalog\Model\Product\Option;

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

    public function __construct(Variables $variables, Json $json)
    {
        $this->variables = $variables;
        $this->json = $json;
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
            }
        }

        return $this->json->encode($config);
    }
}
