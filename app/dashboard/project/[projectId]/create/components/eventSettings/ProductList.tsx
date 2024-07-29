"use client";

import { Tables, TablesInsert } from "@/supabase/types";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  TransitionStartFunction,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "@/lib/actions/products";
import { showToastError } from "@/components/shared/showToast";
import { useRouter } from "next/navigation";
import { Camera, CirclePlus, Trash2 } from "lucide-react";
import { createClient } from "@/supabase/client";
import Image from "next/image";
import { updateEvent } from "@/lib/actions/events";

export default function ProductList({
  currentEvent,
  setEvents,
  startEventTransition,
}: {
  currentEvent: Tables<"Events">;
  setEvents: Dispatch<SetStateAction<Tables<"Events">[]>>;
  startEventTransition: TransitionStartFunction;
}) {
  interface ProductRefs {
    [key: number]: {
      name: HTMLInputElement | null;
      price: HTMLInputElement | null;
      link: HTMLInputElement | null;
    };
  }
  const router = useRouter();
  const productRefs = useRef<ProductRefs>({});
  const [isProductListPending, startProductTransition] = useTransition();

  /* Product state variables */
  const [products, setProducts] = useState<Tables<"Products">[]>([]);
  const [isShowProductsChecked, setShowProductsChecked] = useState(
    currentEvent?.show_products || false
  );
  const [activeProduct, setActiveProduct] = useState<Tables<"Products"> | null>(
    products[0] || null
  );
  const [productImageSrc, setProductImageSrc] = useState<string>(
    activeProduct?.image_url ? activeProduct.image_url : ""
  );

  useEffect(() => {
    startProductTransition(() => {
      startEventTransition(async () => {
        const { data, error } = await getProducts(currentEvent.id);
        if (error) {
          showToastError(error);
        } else {
          setProducts(data);
        }
      });
    });
  }, [currentEvent, startEventTransition]);

  const handleFileUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    productId: number
  ) => {
    startEventTransition(async () => {
      const supabase = createClient();
      let file;
      if (e.target.files) {
        file = e.target.files[0];
        const filename = `${currentEvent.user_id}/${file?.name}`;
        const { data, error } = await supabase.storage
          .from("product-images")
          .upload(filename, file, {
            upsert: true,
          });
        if (error) {
          showToastError(error);
        } else {
          const newImageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${data.path}`;
          setProductImageSrc(newImageUrl);
          const { error } = await updateProduct(productId, {
            image_url: newImageUrl,
          });
          if (error) {
            showToastError(error);
          } else {
            //router.refresh();
          }
        }
      }
    });
  };

  const handleShowProductsToggle = () => {
    startEventTransition(async () => {
      setShowProductsChecked(!isShowProductsChecked);
      const eventUpdateResult = await updateEvent(currentEvent.id, {
        ...currentEvent,
        show_products: !isShowProductsChecked,
      });

      if (eventUpdateResult.error) {
        showToastError(eventUpdateResult.error);
      } else {
        setEvents((prevEvents) =>
          prevEvents.map((e) =>
            e.id === currentEvent.id
              ? { ...e, show_products: !isShowProductsChecked }
              : e
          )
        );
      }
    });
  };

  const handleCreateProduct = () => {
    startEventTransition(async () => {
      const product: TablesInsert<"Products"> = {
        event_id: currentEvent.id,
        user_id: currentEvent.user_id,
      };
      const { data, error } = await createProduct(product);
      if (error) {
        showToastError(error);
      } else {
        setProducts((prevProducts) => [...prevProducts, data]);
        //router.refresh();
      }
    });
  };

  const handleDeleteProduct = (productId: number) => {
    startEventTransition(async () => {
      const { data, error } = await deleteProduct(productId);
      if (error) {
        showToastError(error);
      } else {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== data.id)
        );
        //router.refresh();
      }
    });
  };

  useEffect(() => {
    const handleUpdateProduct = (event: MouseEvent) => {
      startEventTransition(() => {
        if (activeProduct) {
          const productRef = productRefs.current[activeProduct.id];
          const currentProduct = products.find(
            (product) => product.id === activeProduct.id
          );
          if (!currentProduct || !productRef) return;

          let updatedProduct = { ...currentProduct };
          let shouldUpdate = false;

          if (
            productRef.name &&
            productRef.name.value !== "" &&
            productRef.name.value !== currentProduct.name
          ) {
            updatedProduct = {
              ...updatedProduct,
              name: productRef.name.value,
            };
            shouldUpdate = true;
          }
          if (
            productRef.price &&
            productRef.price.value !== "" &&
            productRef.price.value !== currentProduct.price?.toString()
          ) {
            updatedProduct = {
              ...updatedProduct,
              price: parseFloat(productRef.price.value),
            };
            shouldUpdate = true;
          }
          if (
            productRef.link &&
            productRef.link.value !== "" &&
            productRef.link.value !== currentProduct.link
          ) {
            updatedProduct = {
              ...updatedProduct,
              link: productRef.link.value,
            };
            shouldUpdate = true;
          }

          if (shouldUpdate) {
            setActiveProduct(updatedProduct);
            updateProduct(activeProduct.id, updatedProduct);
            //router.refresh();
          }
        }
      });
    };

    document.addEventListener("mousedown", handleUpdateProduct);
    return () => {
      document.removeEventListener("mousedown", handleUpdateProduct);
    };
  }, [activeProduct, setActiveProduct, products, router, startEventTransition]);

  const assignRef = (
    el: HTMLInputElement | null,
    productId: number,
    refType: keyof ProductRefs[number]
  ) => {
    if (el) {
      if (!productRefs.current[productId]) {
        productRefs.current[productId] = {
          name: null,
          price: null,
          link: null,
        };
      }
      productRefs.current[productId][refType] = el;
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex flex-row w-full justify-between">
        <div className="flex items-center gap-2 font-bold">
          Products{" "}
          <input
            type="checkbox"
            checked={isShowProductsChecked}
            className="toggle toggle-primary toggle-sm"
            onChange={handleShowProductsToggle}
          />
        </div>
        {isShowProductsChecked && (
          <div
            className="btn btn-sm lg:mt-0 mt-8 lg:w-auto w-full btn-ghost text-xs"
            onClick={handleCreateProduct}
          >
            <CirclePlus height={14} width={14} />
            New
          </div>
        )}
      </div>
      {isShowProductsChecked &&
        (!products || products.length === 0 ? (
          <div className="text-gray-400 text-xs">
            You haven&apos;t created any products yet.
          </div>
        ) : !isProductListPending ? (
          products.map((product, i) => (
            <div
              key={product.id}
              className="flex flex-row w-full items-center mb-4"
            >
              <div className="flex w-fit items-center">
                <label
                  htmlFor="product-image-file-input"
                  className={`flex justify-center mr-3 cursor-pointer items-center min-w-[48px] max-h-[48px] aspect-square rounded-lg ${
                    !product.image_url || product.image_url === ""
                      ? "bg-primary/35"
                      : "bg-white"
                  } relative`}
                >
                  <input
                    type="file"
                    name="image"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="product-image-file-input"
                    onChange={(e) => handleFileUpload(e, product.id)}
                  />
                  {product.image_url && product.image_url !== "" ? (
                    <Image
                      width={48}
                      height={48}
                      alt="product-img"
                      src={product.image_url}
                      className="rounded-lg"
                    />
                  ) : (
                    <Camera
                      width={20}
                      height={20}
                      color="oklch(var(--p)"
                      className="!z-[1]"
                    />
                  )}
                </label>
              </div>
              <div className="flex flex-col w-full gap-1">
                <div className="flex flex-row gap-2">
                  <div className="flex flex-col w-full gap-1">
                    <p className="text-xs mt-4">Product Name</p>
                    <input
                      type="text"
                      ref={(el) => assignRef(el, product.id, "name")}
                      onMouseDown={() => setActiveProduct(product)}
                      placeholder="Ex: Tennis Shoes"
                      defaultValue={product.name || ""}
                      className="input input-bordered input-sm w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs mt-4">Price</p>
                    <input
                      type="text"
                      ref={(el) => assignRef(el, product.id, "price")}
                      onMouseDown={() => setActiveProduct(product)}
                      placeholder="0.00"
                      defaultValue={product.price || ""}
                      className="input input-bordered input-sm max-w-[120px]"
                    />
                  </div>
                </div>
                <div className="flex flex-col w-full gap-1">
                  <p className="text-xs">Link (optional)</p>
                  <input
                    type="url"
                    ref={(el) => assignRef(el, product.id, "link")}
                    onMouseDown={() => setActiveProduct(product)}
                    placeholder="https://www.my-site.com/my-awesome-product"
                    defaultValue={product.link || ""}
                    className="input input-bordered input-sm w-full"
                  />
                </div>
              </div>
              <div
                className="hover:bg-link-hover p-2 ml-1 rounded-lg cursor-pointer -mt-[20px]"
                onClick={() => handleDeleteProduct(product.id)}
              >
                <Trash2 width={18} height={18} />
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-row w-full items-center mt-4 mb-4">
            <div className="flex w-fit items-center">
              <div className="skeleton bg-primary/20 mr-3 items-center min-w-[48px] max-h-[48px] aspect-square rounded-lg"></div>
            </div>
            <div className="flex flex-col w-full gap-3">
              <div className="skeleton rounded-lg h-6 w-full bg-primary/20" />
              <div className="skeleton rounded-lg h-6 w-[80%] bg-primary/20" />
            </div>
          </div>
        ))}
    </div>
  );
}