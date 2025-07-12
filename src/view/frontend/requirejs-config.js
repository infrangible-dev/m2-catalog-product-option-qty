/**
 * @author      Andreas Knollmann
 * @copyright   2014-2025 Softwareentwicklung Andreas Knollmann
 * @license     http://www.opensource.org/licenses/mit-license.php MIT
 */

var config = {
    map: {
        '*': {
            productOptionsQty: 'Infrangible_CatalogProductOptionQty/js/product-options-qty',
        }
    },
    config: {
        mixins: {
            'Infrangible_CatalogProductOption/js/price-options': {
                'Infrangible_CatalogProductOptionQty/js/price-options-mixin': true
            }
        }
    }
};
