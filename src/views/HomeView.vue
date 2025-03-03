<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from "vue";
import Input from "@/components/Input.vue";

interface Product {
  title: string;
  description: string;
  discountPercentage: number;
  brand: string;
  price: number;
  thumbnail: string;
  category: string;
  rating: number;
}

const products = ref<Product[]>([]);
const scrollTop = ref(0);
const containerHeight = ref(0);
const containerRef = ref<HTMLElement | null>(null);

const itemHeight = 128;
const buffer = 2;

const fetchProducts = async () => {
  products.value = await fetch("https://dummyjson.com/products?limit=100")
    .then((res) => res.json())
    .then((data) => data.products);
};

const visibleProducts = computed(() => {
  if (!products.value.length) return [];

  const startIndex = Math.max(
    0,
    Math.floor(scrollTop.value / itemHeight) - buffer,
  );
  const endIndex = Math.min(
    products.value.length - 1,
    Math.ceil((scrollTop.value + containerHeight.value) / itemHeight) + buffer,
  );

  return products.value.slice(startIndex, endIndex + 1);
});

const totalHeight = computed(() => products.value.length * itemHeight);

const offsetY = computed(() => {
  const startIndex = Math.max(
    0,
    Math.floor(scrollTop.value / itemHeight) - buffer,
  );
  return Math.max(0, startIndex * itemHeight);
});

const handleScroll = () => {
  if (containerRef.value) {
    scrollTop.value = containerRef.value.scrollTop;
  }
};

const updateContainerHeight = () => {
  if (containerRef.value) {
    containerHeight.value = containerRef.value.clientHeight;
  }
};

onMounted(() => {
  fetchProducts();

  if (containerRef.value) {
    containerRef.value.addEventListener("scroll", handleScroll);
    updateContainerHeight();
    window.addEventListener("resize", updateContainerHeight);
  }
});

onUnmounted(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener("scroll", handleScroll);
  }
  window.removeEventListener("resize", updateContainerHeight);
});
</script>

<template>
  <main
    class="p-5 flex flex-col items-center space-y-6 scrollbar scrollbar-thumb-rose-500"
  >
    <Input />
    <div
      ref="containerRef"
      class="w-1/3 bg-white shadow-md rounded-xl p-4 overflow-y-auto h-96 overflow-x-hidden relative"
    >
      <div
        class="absolute top-0 left-0 right-0"
        :style="{ height: `${totalHeight}px` }"
      >
        <ul
          class="absolute top-0 left-0 right-0"
          :style="{ transform: `translateY(${offsetY}px)` }"
        >
          <li
            v-for="product in visibleProducts"
            :key="product.title"
            class="flex items-start space-x-4 pb-4 last:border-b-0 mb-4"
            :style="{ height: `${itemHeight}px` }"
          >
            <img
              :src="product.thumbnail"
              :alt="product.title"
              class="w-24 h-24 object-cover rounded-lg"
            />
            <div class="flex-1">
              <h2 class="font-semibold text-lg">{{ product.title }}</h2>
              <p class="text-gray-600 text-sm truncate w-1/3">
                {{ product.description }}
              </p>
              <div
                class="flex items-center space-x-3 text-sm text-gray-500 mt-2"
              >
                <span class="text-red-500 font-bold">
                  Discount {{ product.discountPercentage }}%
                </span>
                <span class="text-gray-700 font-medium">{{
                  product.brand
                }}</span>
              </div>
              <div class="flex items-center space-x-3 mt-2">
                <span class="font-bold text-cyan-600"
                  >${{ product.price }}</span
                >
                <span class="text-yellow-500 font-bold flex items-center">
                  ⭐ {{ product.rating }}
                </span>
                <span
                  class="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs"
                >
                  {{ product.category }}
                </span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>
