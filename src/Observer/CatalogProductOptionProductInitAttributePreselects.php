<?php

declare(strict_types=1);

namespace Infrangible\CatalogProductOptionQty\Observer;

use FeWeDev\Base\Variables;
use Magento\Catalog\Model\Product\Option;
use Magento\Framework\DataObject;
use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;

/**
 * @author      Andreas Knollmann
 * @copyright   2014-2025 Softwareentwicklung Andreas Knollmann
 * @license     http://www.opensource.org/licenses/mit-license.php MIT
 */
class CatalogProductOptionProductInitAttributePreselects implements ObserverInterface
{
    /** @var Variables */
    protected $variables;

    public function __construct(Variables $variables)
    {
        $this->variables = $variables;
    }

    public function execute(Observer $observer)
    {
        /** @var DataObject $transportObject */
        $transportObject = $observer->getData('data');

        /** @var Option $option */
        $option = $transportObject->getData('option');
        $result = $transportObject->getData('result');

        $qtyNoneText = $option->getData('qty_none_text');

        if (! $option->getIsRequire() || ! $this->variables->isEmpty($qtyNoneText)) {
            $result = false;
        }

        $observer->setData(
            'result',
            $result
        );

        $transportObject->setData(
            'result',
            $result
        );
    }
}
