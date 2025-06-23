<?php

declare(strict_types=1);

namespace Infrangible\CatalogProductOptionQty\Block\Product\View\Options;

use FeWeDev\Base\Json;
use FeWeDev\Base\Variables;
use Infrangible\Core\Helper\Registry;
use Magento\Catalog\Model\Product;
use Magento\Catalog\Model\Product\Option;
use Magento\Framework\View\Element\Template;

/**
 * @author      Andreas Knollmann
 * @copyright   2014-2025 Softwareentwicklung Andreas Knollmann
 * @license     http://www.opensource.org/licenses/mit-license.php MIT
 */
class Qty extends Template
{
    /** @var Registry */
    protected $registryHelper;

    /** @var Json */
    protected $json;

    /** @var Variables */
    protected $variables;

    /** @var Product */
    private $product;

    public function __construct(
        Template\Context $context,
        Registry $registryHelper,
        Json $json,
        Variables $variables,
        array $data = []
    ) {
        parent::__construct(
            $context,
            $data
        );

        $this->registryHelper = $registryHelper;
        $this->json = $json;
        $this->variables = $variables;
    }

    public function getProduct(): Product
    {
        if (! $this->product) {
            if ($this->registryHelper->registry('current_product')) {
                $this->product = $this->registryHelper->registry('current_product');
            } else {
                throw new \LogicException('Product is not defined');
            }
        }

        return $this->product;
    }

    public function getOptionsConfig(): string
    {
        $config = [];

        $product = $this->getProduct();

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
