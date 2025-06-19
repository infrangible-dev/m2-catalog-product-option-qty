<?php

declare(strict_types=1);

namespace Infrangible\CatalogProductOptionQty\Setup;

use Magento\Framework\DB\Ddl\Table;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\SchemaSetupInterface;
use Magento\Framework\Setup\UpgradeSchemaInterface;

/**
 * @author      Andreas Knollmann
 * @copyright   2014-2025 Softwareentwicklung Andreas Knollmann
 * @license     http://www.opensource.org/licenses/mit-license.php MIT
 */
class UpgradeSchema implements UpgradeSchemaInterface
{
    public function upgrade(SchemaSetupInterface $setup, ModuleContextInterface $context)
    {
        $setup->startSetup();

        $connection = $setup->getConnection();

        $tableName = $connection->getTableName('catalog_product_option');

        if (version_compare(
            $context->getVersion(),
            '1.2.0',
            '<'
        )) {
            if (! $connection->tableColumnExists(
                $tableName,
                'qty_sync'
            )) {
                $connection->addColumn(
                    $tableName,
                    'qty_sync',
                    [
                        'type'     => Table::TYPE_SMALLINT,
                        'length'   => 5,
                        'nullable' => true,
                        'unsigned' => true,
                        'default'  => 0,
                        'comment'  => 'Qty'
                    ]
                );
            }
        }

        $setup->endSetup();
    }
}
