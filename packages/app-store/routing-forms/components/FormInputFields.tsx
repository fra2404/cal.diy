"use client";

import type { Dispatch, SetStateAction } from "react";
import { useEffect, useMemo } from "react";

import type { App_RoutingForms_Form } from "@calcom/prisma/client";
import { SkeletonText } from "@calcom/ui/components/skeleton";

import getFieldIdentifier from "../lib/getFieldIdentifier";
import { getQueryBuilderConfigForFormFields } from "../lib/getQueryBuilderConfig";
import isRouterLinkedField from "../lib/isRouterLinkedField";
import { getUIOptionsForSelect } from "../lib/selectOptions";
import { getFieldResponseForJsonLogic } from "../lib/transformResponse";
import type { SerializableForm, FormResponse, Field } from "../types/types";
import { ConfigFor, withRaqbSettingsAndWidgets } from "./react-awesome-query-builder/config/uiConfig";

export type FormInputFieldsProps = {
  form: Pick<SerializableForm<App_RoutingForms_Form>, "fields">;
  /**
   * Make sure that response is updated by setResponse
   */
  response: FormResponse;
  setResponse: Dispatch<SetStateAction<FormResponse>>;
  /**
   * Identifier of the fields that should be disabled
   */
  disabledFields?: string[];
};

/**
 * A field is visible only when all of its `visibleIf` conditions are currently met.
 * Field ids without conditions are always visible.
 */
function isFieldVisible(field: Field, response: FormResponse): boolean {
  const conditions = field.visibleIf;
  if (!conditions?.length) return true;

  for (const condition of conditions) {
    const answer = response[condition.field]?.value;
    const matches = typeof answer === "string" && answer === condition.value;
    if (condition.operator === "equals" && !matches) return false;
    if (condition.operator === "not_equals" && matches) return false;
  }
  return true;
}

export default function FormInputFields(props: FormInputFieldsProps) {
  const { form, response, setResponse, disabledFields = [] } = props;

  const formFieldsQueryBuilderConfig = withRaqbSettingsAndWidgets({
    config: getQueryBuilderConfigForFormFields(form),
    configFor: ConfigFor.FormFields,
  });

  const hiddenFieldIds = useMemo(() => {
    return (form.fields ?? []).filter((field) => !isFieldVisible(field, response)).map((field) => field.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.fields, response]);

  // Drop stale values of fields that are currently hidden, so they are not submitted.
  useEffect(() => {
    if (!hiddenFieldIds.length) return;
    if (!hiddenFieldIds.some((id) => id in response)) return;
    setResponse((prevResponse) => {
      const next = { ...prevResponse };
      for (const id of hiddenFieldIds) {
        delete next[id];
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hiddenFieldIds]);

  return (
    <>
      {form.fields?.map((field) => {
        if (isRouterLinkedField(field)) {
          // form.fields comes from zodFieldsView, so the value can be a router-liked field with an inner routerField
          const routerField = (field as { routerField?: Field }).routerField;
          // A field that has been deleted from the main form would still be there in the duplicate form but disconnected
          // In that case, it could mistakenly be categorized as RouterLinkedField, so if routerField is nullish, we use the field itself
          field = routerField ?? field;
        }
        if (!isFieldVisible(field, response)) {
          return null;
        }
        const widget = formFieldsQueryBuilderConfig.widgets[field.type];
        if (!("factory" in widget)) {
          return null;
        }
        const Component = widget.factory;

        const options = getUIOptionsForSelect(field);
        const fieldIdentifier = getFieldIdentifier(field);
        return (
          <div key={field.id} className="block flex-col sm:flex ">
            <div className="min-w-48 mb-2 grow">
              <label id="slug-label" htmlFor="slug" className="text-default flex text-sm font-medium">
                {field.label}
              </label>
            </div>
            <Component
              value={response[field.id]?.value ?? ""}
              placeholder={field.placeholder ?? ""}
              // required property isn't accepted by query-builder types
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              /* @ts-ignore */
              required={!!field.required}
              listValues={options}
              disabled={disabledFields?.includes(fieldIdentifier)}
              data-testid={`form-field-${fieldIdentifier}`}
              setValue={(value: number | string | string[]) => {
                setResponse(() => {
                  return {
                    ...response,
                    [field.id]: {
                      label: field.label,
                      identifier: field?.identifier,
                      value: getFieldResponseForJsonLogic({ field, value }),
                    },
                  };
                });
              }}
            />
          </div>
        );
      })}
    </>
  );
}

export const FormInputFieldsSkeleton = () => {
  const numberOfFields = 5;
  return (
    <>
      {Array.from({ length: numberOfFields }).map((_, index) => (
        <div key={index} className="mb-4 block flex-col sm:flex ">
          <SkeletonText className="mb-2 h-3.5 w-64" />
          <SkeletonText className="mb-2 h-9 w-32 w-full" />
        </div>
      ))}
    </>
  );
};
