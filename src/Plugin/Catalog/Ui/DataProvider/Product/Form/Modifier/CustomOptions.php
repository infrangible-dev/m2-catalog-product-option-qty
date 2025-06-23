<?php

declare(strict_types=1);

namespace Infrangible\CatalogProductOptionQty\Plugin\Catalog\Ui\DataProvider\Product\Form\Modifier;

use FeWeDev\Base\Arrays;
use Magento\Ui\Component\Form\Element\Checkbox;
use Magento\Ui\Component\Form\Element\DataType\Text;
use Magento\Ui\Component\Form\Element\Input;
use Magento\Ui\Component\Form\Field;

/**
 * @author      Andreas Knollmann
 * @copyright   2014-2025 Softwareentwicklung Andreas Knollmann
 * @license     http://www.opensource.org/licenses/mit-license.php MIT
 */
class CustomOptions
{
    public const FIELD_QTY_NAME = 'qty';

    public const FIELD_QTY_STEPS_NAME = 'qty_steps';

    public const FIELD_QTY_NONE_TEXT_NAME = 'qty_none_text';

    public const FIELD_QTY_SYNC_NAME = 'qty_sync';

    /** @var Arrays */
    protected $arrays;

    public function __construct(Arrays $arrays)
    {
        $this->arrays = $arrays;
    }

    /**
     * @noinspection PhpUnusedParameterInspection
     */
    public function afterModifyMeta(
        \Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\CustomOptions $subject,
        array $meta
    ): array {
        $meta = $this->arrays->addDeepValue(
            $meta,
            [
                \Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\CustomOptions::GROUP_CUSTOM_OPTIONS_NAME,
                'children',
                \Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\CustomOptions::GRID_OPTIONS_NAME,
                'children',
                'record',
                'children',
                \Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\CustomOptions::CONTAINER_OPTION,
                'children',
                \Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\CustomOptions::CONTAINER_COMMON_NAME,
                'children',
                static::FIELD_QTY_NAME
            ],
            $this->getQtyFieldConfig(41)
        );

        $meta = $this->arrays->addDeepValue(
            $meta,
            [
                \Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\CustomOptions::GROUP_CUSTOM_OPTIONS_NAME,
                'children',
                \Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\CustomOptions::GRID_OPTIONS_NAME,
                'children',
                'record',
                'children',
                \Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\CustomOptions::CONTAINER_OPTION,
                'children',
                \Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\CustomOptions::CONTAINER_COMMON_NAME,
                'children',
                static::FIELD_QTY_STEPS_NAME
            ],
            $this->getQtyStepsFieldConfig(42)
        );

        $meta = $this->arrays->addDeepValue(
            $meta,
            [
                \Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\CustomOptions::GROUP_CUSTOM_OPTIONS_NAME,
                'children',
                \Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\CustomOptions::GRID_OPTIONS_NAME,
                'children',
                'record',
                'children',
                \Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\CustomOptions::CONTAINER_OPTION,
                'children',
                \Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\CustomOptions::CONTAINER_COMMON_NAME,
                'children',
                static::FIELD_QTY_NONE_TEXT_NAME
            ],
            $this->getQtyNoneTextFieldConfig(43)
        );

        return $this->arrays->addDeepValue(
            $meta,
            [
                \Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\CustomOptions::GROUP_CUSTOM_OPTIONS_NAME,
                'children',
                \Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\CustomOptions::GRID_OPTIONS_NAME,
                'children',
                'record',
                'children',
                \Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\CustomOptions::CONTAINER_OPTION,
                'children',
                \Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\CustomOptions::CONTAINER_COMMON_NAME,
                'children',
                static::FIELD_QTY_SYNC_NAME
            ],
            $this->getQtySyncConfig(44)
        );
    }

    protected function getQtyFieldConfig(int $sortOrder): array
    {
        return [
            'arguments' => [
                'data' => [
                    'config' => [
                        'label'         => __('Qty'),
                        'componentType' => Field::NAME,
                        'formElement'   => Checkbox::NAME,
                        'dataScope'     => static::FIELD_QTY_NAME,
                        'dataType'      => Text::NAME,
                        'sortOrder'     => $sortOrder,
                        'value'         => '0',
                        'valueMap'      => [
                            'true'  => '1',
                            'false' => '0'
                        ]
                    ]
                ]
            ]
        ];
    }

    protected function getQtyStepsFieldConfig(int $sortOrder): array
    {
        return [
            'arguments' => [
                'data' => [
                    'config' => [
                        'label'         => __('Qty Steps'),
                        'componentType' => Field::NAME,
                        'formElement'   => Input::NAME,
                        'dataScope'     => static::FIELD_QTY_STEPS_NAME,
                        'dataType'      => Text::NAME,
                        'sortOrder'     => $sortOrder
                    ]
                ]
            ]
        ];
    }

    protected function getQtyNoneTextFieldConfig(int $sortOrder): array
    {
        return [
            'arguments' => [
                'data' => [
                    'config' => [
                        'label'         => __('None Text'),
                        'componentType' => Field::NAME,
                        'formElement'   => Input::NAME,
                        'dataScope'     => static::FIELD_QTY_NONE_TEXT_NAME,
                        'dataType'      => Text::NAME,
                        'sortOrder'     => $sortOrder
                    ]
                ]
            ]
        ];
    }

    protected function getQtySyncConfig(int $sortOrder): array
    {
        return [
            'arguments' => [
                'data' => [
                    'config' => [
                        'label'         => __('Qty Sync'),
                        'componentType' => Field::NAME,
                        'formElement'   => Checkbox::NAME,
                        'dataScope'     => static::FIELD_QTY_SYNC_NAME,
                        'dataType'      => Text::NAME,
                        'sortOrder'     => $sortOrder,
                        'value'         => '0',
                        'valueMap'      => [
                            'true'  => '1',
                            'false' => '0'
                        ]
                    ]
                ]
            ]
        ];
    }
}
