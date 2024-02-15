import { Alert, Linking, ScrollView, Text, View } from "react-native";
import { Header } from "@/components/header";
import { Product } from "@/components/product";
import { ProductCartProps, useCartStore } from "@/stores/cart-store";
import { formatCurrency } from "@/utils/functions/format-currency";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { Feather } from "@expo/vector-icons";
import { LinkButton } from "@/components/link-button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState } from "react";
import { useNavigation } from "expo-router";

const PHONE_NUMBER = "819036196977";

export default function Cart() {
  const [address, setAddress] = useState("Casa");
  const cartStore = useCartStore();
  const navigation = useNavigation();

  const total = formatCurrency(cartStore.products.reduce((total, product) => total + product.price * product.quantity, 0));

  function handleProductRemove(product: ProductCartProps) {
    Alert.alert("Remover", `Deseja remover ${product.title} do carrinho?`, [
      {
        text: "Cancelar"
      },
      {
        text: "Remover",
        onPress: () => cartStore.remove(product.id)
      }
    ])
  }

  function handleOrder() {
    if(address.trim().length === 0) {
      return Alert.alert("Pedido", "Informe o endereço de entrega!");
    }

    const products = cartStore.products.map((product) => `\n ${product.quantity} ${product.title}`).join("");

    const message = `
      \n 🍔 NOVO PEDIDO
      \n Entregar em: ${address}
      ${products}
      \n Valor total: ${total} 💴
    `;
    
    Linking.openURL(`http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${message}`);

    cartStore.clear();
    navigation.goBack();
  }

  return (
    <View className="flex-1 pt-8">
      <Header title="Seu Carrinho" />

      {
        cartStore.products.length > 0 ? (
          <KeyboardAwareScrollView>
            <ScrollView className="p-5 flex-1">
              {
                cartStore.products.map((product) =>(
                  <Product 
                    key={product.id} 
                    data={product} 
                    onPress={() => handleProductRemove(product)}
                  />
                ))
              }
              <View className="border-t border-slate-700 pt-4">
                <Input 
                  placeholder="Informe o endereço de entrega com rua, bairro, CEP, número e complemento..."
                  onChangeText={setAddress}
                  blurOnSubmit={true}
                  onSubmitEditing={handleOrder}
                  returnKeyType="next"
                />
              </View>
            </ScrollView>
          </KeyboardAwareScrollView>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="font-body text-lg text-slate-400 text-center my-8">
              Seu carrinho está vazio
            </Text>
          </View>
        )
      }
      <View className="flex-row gap-2 items-center px-5 mt-2 mb-1">
        <Text className="text-white text-xl font-subtitle">Total:</Text>
        <Text className="text-lime-400 text-2xl font-heading">{total}</Text>
      </View>

      <View className="p-5 gap-5">
        <Button onPress={handleOrder}>
          <Button.Text>
            Enviar Pedido
          </Button.Text>

          <Button.Icon>
            <Feather name="arrow-right-circle" size={20} />
          </Button.Icon>
        </Button>

        <LinkButton title="Voltar ao cardápio" href="/" />
      </View>

    </View>
  )
}