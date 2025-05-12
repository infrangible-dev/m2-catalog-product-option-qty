<?php

declare(strict_types=1);

namespace Infrangible\CatalogProductOptionQty\Plugin\Framework\View\Element\Html;

use Infrangible\Core\Helper\Registry;
use Magento\Catalog\Model\Product\Option;

/**
 * @author      Andreas Knollmann
 * @copyright   2014-2025 Softwareentwicklung Andreas Knollmann
 * @license     http://www.opensource.org/licenses/mit-license.php MIT
 */
class Select
{
    /** @var Registry */
    protected $registryHelper;

    public function __construct(Registry $registryHelper)
    {
        $this->registryHelper = $registryHelper;
    }

    public function beforeGetHtml(\Magento\Framework\View\Element\Html\Select $subject): void
    {
        $option = $this->registryHelper->registry('current_option');

        if ($option instanceof Option) {
            $optionQty = $option->getData('qty');

            if ($optionQty) {
                $dataRoleParam = 'data-role="qty"';

                $extraParams = $subject->getDataUsingMethod('extra_params');

                $extraParams = $extraParams === null ? $dataRoleParam : ($extraParams . $dataRoleParam);

                $subject->setDataUsingMethod(
                    'extra_params',
                    $extraParams
                );
            }
        }
    }
}
