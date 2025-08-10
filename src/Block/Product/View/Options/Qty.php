<?php

declare(strict_types=1);

namespace Infrangible\CatalogProductOptionQty\Block\Product\View\Options;

use FeWeDev\Base\Json;
use Infrangible\CatalogProductOptionQty\Helper\Data;
use Infrangible\Core\Helper\Registry;
use Magento\Catalog\Model\Product;
use Magento\Framework\Locale\Format;
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

    /** @var Data */
    protected $helper;

    /** @var Json */
    protected $json;

    /** @var Format */
    protected $localeFormat;

    /** @var Product */
    private $product;

    public function __construct(
        Template\Context $context,
        Registry $registryHelper,
        Data $helper,
        Json $json,
        Format $localeFormat,
        array $data = []
    ) {
        parent::__construct(
            $context,
            $data
        );

        $this->registryHelper = $registryHelper;
        $this->helper = $helper;
        $this->json = $json;
        $this->localeFormat = $localeFormat;
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
        return $this->helper->getOptionsConfig($this->getProduct());
    }

    public function getPriceFormatJson(): string
    {
        return $this->json->encode($this->localeFormat->getPriceFormat());
    }
}
